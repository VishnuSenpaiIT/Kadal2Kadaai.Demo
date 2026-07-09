<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Consumer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Enums\OrderStatus;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Services\Inventory\InventoryService;
use App\Notifications\OrderCreatedNotification;

class OrderController extends Controller
{
    use ApiResponse;

    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * List all orders for the authenticated consumer.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with([
            'items.product:id,name,slug,weight_unit',
            'address',
            'seller:id,first_name,last_name',
            'consumer:id,first_name,last_name,contact_number',
        ])
            ->where('consumer_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 10));

        return $this->successResponse($orders, 'Orders retrieved');
    }

    /**
     * Get a specific order.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::with([
            'items.product:id,name,slug,weight_unit',
            'address',
            'seller:id,first_name,last_name',
            'consumer:id,first_name,last_name,contact_number',
        ])
            ->where('consumer_id', $request->user()->id)
            ->findOrFail($id);

        return $this->successResponse($order, 'Order retrieved');
    }

    /**
     * Checkout: convert the active cart into an order.
     * Fix 4: Uses DB::transaction with lockForUpdate() to prevent inventory race conditions.
     * Fix 5: Re-validates min/max order quantities at checkout time.
     * Fix 8: Tax is now included in total calculations consistently.
     */
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id' => 'required|uuid|exists:addresses,id',
            'notes'      => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        // Verify the address belongs to this user
        $address = Address::where('id', $validated['address_id'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Get active cart
        $cart = Cart::where('consumer_id', $user->id)
            ->where('status', 'ACTIVE')
            ->with(['items.product'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return $this->errorResponse('Cart is empty. Add items before checking out.', 422);
        }

        // Fix 5: Pre-flight validation of min/max order quantities before entering transaction
        foreach ($cart->items as $item) {
            $product = $item->product;
            if (!$product) {
                return $this->errorResponse("A product in your cart is no longer available.", 422);
            }

            $minQty = $product->minimum_order_quantity ?? 0.001;
            $maxQty = $product->maximum_order_quantity;

            if ($item->quantity < $minQty) {
                return $this->errorResponse(
                    "Minimum order quantity for {$product->name} is {$minQty} {$product->weight_unit}.",
                    422
                );
            }

            if ($maxQty !== null && $item->quantity > $maxQty) {
                return $this->errorResponse(
                    "Maximum order quantity for {$product->name} is {$maxQty} {$product->weight_unit}.",
                    422
                );
            }
        }

        $orders = [];

        // Fix 4: All stock checks and mutations happen inside the transaction.
        // lockForUpdate() on each product prevents overselling under concurrent checkouts.
        DB::transaction(function () use ($cart, $user, $address, $validated, &$orders) {
            // Group items by seller (create one order per seller)
            $itemsBySeller = $cart->items->groupBy('seller_id');

            foreach ($itemsBySeller as $sellerId => $items) {
                $subtotal = $items->sum('total_price');
                // Fix 8: 5% tax is calculated consistently
                $tax = round($subtotal * 0.05, 2);

                // Location-based shipping rate calculation
                $delivery = null;
                if ($address && !empty($address->area_locality)) {
                    $matchedArea = \App\Models\Area::whereRaw('LOWER(name) = ?', [strtolower(trim($address->area_locality))])->first();
                    if ($matchedArea) {
                        $delivery = (float) $matchedArea->shipping_price;
                    }
                }

                // Fallback to original flat shipping rate logic if no match found
                if ($delivery === null) {
                    $delivery = ($subtotal >= 1000.0) ? 0.0 : 50.00;
                }

                $total = $subtotal + $tax + $delivery;

                $order = Order::create([
                    'order_number'    => $this->generateOrderNumber(),
                    'consumer_id'     => $user->id,
                    'seller_id'       => $sellerId,
                    'address_id'      => $address->id,
                    'status'          => OrderStatus::PendingSellerApproval->value,
                    'subtotal'        => $subtotal,
                    'tax_amount'      => $tax,
                    'delivery_fee'    => $delivery,
                    'discount_amount' => 0,
                    'total'           => $total,
                    'notes'           => $validated['notes'] ?? null,
                ]);

                foreach ($items as $item) {
                    // Fix 4: Lock the product row to prevent concurrent overselling
                    $product = \App\Models\Product::lockForUpdate()->findOrFail($item->product_id);

                    if ($product->available_quantity < $item->quantity) {
                        throw new \Exception(
                            "Insufficient stock for: {$product->name}. Only {$product->available_quantity} {$product->weight_unit} available."
                        );
                    }

                    $variantObj = null;
                    if ($item->selected_variant) {
                        foreach ($product->variants as $v) {
                            if (isset($v['name']) && $v['name'] === $item->selected_variant) {
                                $variantObj = [
                                    'name'            => $v['name'],
                                    'price_modifier'  => $v['price_modifier'] ?? 0,
                                ];
                                break;
                            }
                        }
                    }

                    OrderItem::create([
                        'order_id'         => $order->id,
                        'product_id'       => $item->product_id,
                        'quantity'         => $item->quantity,
                        'unit_price'       => $item->unit_price,
                        'total_price'      => $item->total_price,
                        'product_snapshot' => [
                            'name'             => $product->name,
                            'price'            => $product->price,
                            'weight_unit'      => $product->weight_unit,
                            'category'         => $product->category?->name,
                            'selected_variant' => $variantObj,
                        ],
                    ]);

                    // Fix 4: Use InventoryService to reserve stock (runs after lock is acquired)
                    $this->inventoryService->reserveStock($product, $item->quantity);
                }

                $orders[] = $order->load(['items', 'address', 'seller:id,first_name,last_name']);

                // Notify seller
                if ($order->seller) {
                    $order->seller->notify(new OrderCreatedNotification($order));
                }
            }

            // Mark cart as converted
            $cart->update(['status' => 'CONVERTED_TO_ORDER']);
            $cart->items()->delete();

            // Update consumer profile
            if ($user->consumerProfile) {
                $totalSpending = collect($orders)->sum('total');
                $user->consumerProfile->increment('lifetime_orders', count($orders));
                $user->consumerProfile->increment('lifetime_spending', $totalSpending);

                // Give 1 loyalty point per 100 spent
                $points = floor($totalSpending / 100);
                if ($points > 0) {
                    $user->consumerProfile->increment('loyalty_points', $points);
                }
            }
        });

        return $this->successResponse(
            count($orders) === 1 ? $orders[0] : $orders,
            'Order placed successfully',
            201
        );
    }

    /**
     * Cancel a pending order.
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $order = Order::where('consumer_id', $request->user()->id)->findOrFail($id);

        if (!$order->isCancellable()) {
            return $this->errorResponse('This order cannot be cancelled in its current status.', 422);
        }

        $order->update([
            'status'        => OrderStatus::Cancelled->value,
            'cancelled_at'  => now(),
            'cancel_reason' => $validated['reason'] ?? 'Cancelled by consumer',
        ]);

        // Restore stock via InventoryService
        foreach ($order->items as $item) {
            if ($item->product) {
                $this->inventoryService->releaseStock($item->product, $item->quantity);
            }
        }

        return $this->successResponse($order->fresh(), 'Order cancelled');
    }

    /**
     * Generate a unique-enough order number.
     * Uses random(8) + date for lower collision probability.
     * A unique DB constraint on order_number provides the final safety net.
     */
    private function generateOrderNumber(): string
    {
        return 'ORD-' . strtoupper(Str::random(8)) . '-' . date('Ymd');
    }
}
