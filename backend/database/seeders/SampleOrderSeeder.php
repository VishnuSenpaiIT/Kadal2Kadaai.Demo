<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Product;
use App\Models\Commission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SampleOrderSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or fetch roles
        $sellerRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'seller', 'guard_name' => 'web']);
        $consumerRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'consumer', 'guard_name' => 'web']);

        // 2. Create a proper Seller
        $seller = User::firstOrCreate(
            ['email' => 'seller@kadal.local'],
            [
                'id' => (string) Str::uuid(),
                'first_name' => 'Fresh',
                'last_name' => 'Fishes',
                'password' => bcrypt('password123'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $seller->assignRole($sellerRole);

        // Assign all products to the seller so checkout / dashboard analytics link correctly
        Product::query()->update(['seller_id' => $seller->id]);

        // 3. Create dummy consumer users registered on different days in the last 30 days
        $consumers = [];
        $names = [
            ['Arun', 'Kumar'],
            ['Suresh', 'Raina'],
            ['Priya', 'Dharshini'],
            ['Karthik', 'Subbaraj'],
            ['Vijay', 'Sethupathi'],
            ['Anitha', 'Rajeswari'],
        ];

        foreach ($names as $idx => $name) {
            $email = strtolower($name[0]) . '@kadal.local';
            $registrationDate = Carbon::now()->subDays(rand(1, 28));
            
            $consumer = User::firstOrCreate(
                ['email' => $email],
                [
                    'id' => (string) Str::uuid(),
                    'first_name' => $name[0],
                    'last_name' => $name[1],
                    'password' => bcrypt('password123'),
                    'status' => 'active',
                    'email_verified_at' => $registrationDate,
                    'created_at' => $registrationDate,
                    'updated_at' => $registrationDate,
                ]
            );
            $consumer->assignRole($consumerRole);
            $consumers[] = $consumer;

            // Create an address
            Address::firstOrCreate(
                ['user_id' => $consumer->id, 'address_type' => 'Home'],
                [
                    'id' => (string) Str::uuid(),
                    'full_name' => $consumer->name,
                    'mobile_number' => '9876543210',
                    'house_flat_number' => (10 + $idx),
                    'street_name' => 'Beach Rd',
                    'area_locality' => 'Royapuram',
                    'city' => 'Chennai',
                    'district' => 'Chennai',
                    'state' => 'Tamil Nadu',
                    'pincode' => '600013',
                    'latitude' => 13.1137,
                    'longitude' => 80.2954,
                    'is_default' => true
                ]
            );
        }

        // Add customer@kadal.local to consumers array
        $customerUser = User::where('email', 'customer@kadal.local')->first();
        if ($customerUser) {
            $consumers[] = $customerUser;
            Address::firstOrCreate(
                ['user_id' => $customerUser->id, 'address_type' => 'Home'],
                [
                    'id' => (string) Str::uuid(),
                    'full_name' => 'Demo Customer',
                    'mobile_number' => '9876543211',
                    'house_flat_number' => '24',
                    'street_name' => 'Marina Drive',
                    'area_locality' => 'Mylapore',
                    'city' => 'Chennai',
                    'district' => 'Chennai',
                    'state' => 'Tamil Nadu',
                    'pincode' => '600004',
                    'latitude' => 13.0330,
                    'longitude' => 80.2785,
                    'is_default' => true
                ]
            );
        }

        // Get some products to create order items
        $products = Product::all();
        if ($products->isEmpty()) {
            return;
        }

        // 4. Create orders over the past 30 days
        $orderCount = 20;
        $statuses = [
            'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 
            'out_for_delivery', 'ready_for_delivery', 'processing', 'pending_seller_approval', 
            'cancelled', 'rejected'
        ];

        for ($i = 0; $i < $orderCount; $i++) {
            $date = Carbon::now()->subDays(rand(0, 29))->subHours(rand(0, 23));
            $consumer = $consumers[array_rand($consumers)];
            $status = $statuses[array_rand($statuses)];
            
            // Adjust dates for delivered orders to have delivered today if selected
            if ($i < 3) {
                // Force 3 delivered orders today to show active daily stats!
                $date = Carbon::now();
                $status = 'delivered';
            }

            $address = Address::where('user_id', $consumer->id)->first();
            if (!$address) continue;

            $subtotal = 0;
            $itemsToCreate = [];
            $itemCount = rand(1, 3);
            
            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $qty = rand(1, 4);
                $price = (float) $product->price;
                $tot = $price * $qty;
                $subtotal += $tot;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'total_price' => $tot,
                    'product_snapshot' => [
                        'name' => $product->name,
                        'price' => $price,
                        'weight_unit' => $product->weight_unit,
                    ]
                ];
            }

            $tax = round($subtotal * 0.05, 2);
            $delivery = 50.00;
            $total = $subtotal + $tax + $delivery;

            $order = Order::create([
                'id' => (string) Str::uuid(),
                'order_number' => 'ORD-' . strtoupper(Str::random(4)) . '-' . $date->format('Ymd') . '-' . $i,
                'consumer_id' => $consumer->id,
                'seller_id' => $seller->id,
                'address_id' => $address->id,
                'status' => $status,
                'subtotal' => $subtotal,
                'tax_amount' => $tax,
                'delivery_fee' => $delivery,
                'discount_amount' => 0,
                'total' => $total,
                'created_at' => $date,
                'updated_at' => $date,
            ]);

            foreach ($itemsToCreate as $itemData) {
                OrderItem::create(array_merge($itemData, ['order_id' => $order->id]));
            }

            // Create commission records for some delivered orders to test both paths
            if ($status === 'delivered' && rand(0, 1) === 1) {
                $commissionAmt = round($subtotal * 0.12, 2);
                Commission::create([
                    'id' => (string) Str::uuid(),
                    'order_id' => $order->id,
                    'seller_id' => $seller->id,
                    'gross_amount' => $subtotal,
                    'commission_rate' => 12.00, // 12% commission
                    'commission_amount' => $commissionAmt,
                    'net_amount' => $subtotal - $commissionAmt,
                    'status' => 'settled',
                    'settled_at' => $date,
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);
            }
        }
    }
}
