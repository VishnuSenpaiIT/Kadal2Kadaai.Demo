<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
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

        return response()->json(['success' => true, 'message' => 'Orders retrieved', 'data' => $orders]);
    }

    public function show(string $id)
    {
        $order = Order::with([
            'items.product',
            'consumer:id,first_name,last_name,contact_number,email',
            'seller:id,first_name,last_name',
            'address',
        ])->findOrFail($id);
        
        return response()->json(['success' => true, 'message' => 'Order retrieved', 'data' => $order]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending_seller_approval,approved,processing,ready_for_delivery,out_for_delivery,delivered,cancelled,rejected,refunded',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data'    => $order
        ]);
    }
}
