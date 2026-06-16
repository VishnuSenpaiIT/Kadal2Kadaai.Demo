<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // Fetch all reviews (for admin)
    public function index()
    {
        $reviews = Review::with(['user:id,first_name,last_name,avatar', 'product:id,name'])->latest()->get();
        return response()->json($reviews);
    }

    // Fetch published reviews for a product (for consumers)
    public function productReviews($productId)
    {
        $reviews = Review::with(['user:id,first_name,last_name,avatar'])
            ->where('product_id', $productId)
            ->where('status', 'published')
            ->latest()
            ->get();
        return response()->json($reviews);
    }

    // Submit a review (for consumers)
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
        ]);

        $review = Review::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'title' => $request->title,
            'content' => $request->content,
            'status' => 'pending', // Default to pending approval
        ]);

        return response()->json(['message' => 'Review submitted successfully', 'review' => $review], 201);
    }

    // Update review status (for admin)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,published,archived',
        ]);

        $review = Review::findOrFail($id);
        $review->update(['status' => $request->status]);

        return response()->json(['message' => 'Review status updated successfully', 'review' => $review]);
    }
}
