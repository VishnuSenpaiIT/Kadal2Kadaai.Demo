<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\Inventory\InventoryService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Enums\OrderStatus;

class OrderController extends Controller
{
    use ApiResponse;

    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request)
    {
        $orders = Order::with([
            'items.product:id,name,slug',
            'consumer:id,first_name,last_name,contact_number',
            'seller:id,first_name,last_name',
            'address',
        ])
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('order_number', 'like', '%' . $request->search . '%');
            })
            ->latest()
            ->paginate($request->get('per_page', 20));

        return $this->successResponse($orders, 'Orders retrieved');
    }

    public function show(string $id)
    {
        $order = Order::with([
            'items.product',
            'consumer:id,first_name,last_name,contact_number,email',
            'seller:id,first_name,last_name',
            'address',
        ])->findOrFail($id);

        return $this->successResponse($order, 'Order retrieved');
    }

    /**
     * Fix 7: Admin updateStatus now syncs inventory:
     *  - 'cancelled'  → releases reserved stock back to available
     *  - 'delivered'  → fulfills (deducts) reserved stock permanently
     *  - Other statuses → no inventory change
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending_seller_approval,approved,processing,ready_for_delivery,out_for_delivery,delivered,cancelled,rejected,refunded',
        ]);

        $order = Order::with('items.product')->findOrFail($id);

        $previousStatus = $order->status;
        $newStatus = $request->status;

        $order->update(['status' => $newStatus]);

        // Fix 7: Sync inventory based on terminal status transitions
        if (in_array($newStatus, ['cancelled', 'rejected']) && !$previousStatus->isTerminal()) {
            // Restore reserved stock back to available
            foreach ($order->items as $item) {
                if ($item->product) {
                    $this->inventoryService->releaseStock($item->product, $item->quantity);
                }
            }
        } elseif ($newStatus === 'delivered' && $previousStatus !== OrderStatus::Delivered) {
            // Permanently deduct reserved stock (order fulfilled)
            foreach ($order->items as $item) {
                if ($item->product) {
                    $this->inventoryService->fulfillStock($item->product, $item->quantity);
                }
            }
        }

        return $this->successResponse($order->fresh(), 'Order status updated successfully');
    }
}
