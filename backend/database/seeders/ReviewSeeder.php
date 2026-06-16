<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Review;
use App\Models\User;
use App\Models\Product;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('status', \App\Enums\UserStatus::Active)->take(5)->get();
        $products = Product::where('product_status', \App\Enums\ProductStatus::PUBLISHED)->take(5)->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        $dummyReviews = [
            [
                'rating' => 5,
                'title' => 'Excellent Quality!',
                'content' => 'The seafood was extremely fresh. Packaging was top-notch with dry ice. Delivered on time. Will definitely order again.',
                'status' => 'published'
            ],
            [
                'rating' => 4,
                'title' => 'Good, but a bit pricey',
                'content' => 'The taste is amazing, truly sea-fresh as promised. But I feel the delivery charges are a little high. Still recommending it.',
                'status' => 'published'
            ],
            [
                'rating' => 5,
                'title' => 'Test Dummy Review',
                'content' => 'This is a test review for the UI check. The layout seems to be handling long texts properly without breaking the design.',
                'status' => 'pending'
            ],
            [
                'rating' => 2,
                'title' => 'Disappointed with the size',
                'content' => 'The actual product size was smaller than what was shown in the pictures. Taste was okay, but expected better quality for the price.',
                'status' => 'published'
            ],
            [
                'rating' => 1,
                'title' => 'Late delivery and thawed',
                'content' => 'By the time it reached me, the ice packs had melted. Was not comfortable consuming it. Have asked for a refund.',
                'status' => 'archived'
            ]
        ];

        foreach ($products as $product) {
            foreach ($dummyReviews as $index => $reviewData) {
                // Ensure we don't run out of users
                $user = $users[$index % $users->count()];

                Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => $reviewData['rating'],
                    'title' => $reviewData['title'],
                    'content' => $reviewData['content'],
                    'status' => $reviewData['status'],
                ]);
            }
        }
    }
}
