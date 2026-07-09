<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create roles via Spatie
        $adminRole    = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin',    'guard_name' => 'web']);
        $sellerRole   = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'seller',   'guard_name' => 'web']);
        $consumerRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'consumer', 'guard_name' => 'web']);
        
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'seller_staff', 'guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'operations_manager', 'guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'regional_manager', 'guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'finance_manager', 'guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'support_agent', 'guard_name' => 'web']);

        // Admin user for Operations portal
        $admin1 = \App\Models\User::firstWhere('email', 'admin@kadal.local');
        if (!$admin1) {
            $admin1 = \App\Models\User::create([
                'email'        => 'admin@kadal.local',
                'id'           => (string) \Illuminate\Support\Str::uuid(),
                'first_name'   => 'Kadal',
                'last_name'    => 'Admin',
                'password'     => bcrypt('Admin@12345'),
                'status'       => 'active',
                'email_verified_at' => now(),
            ]);
        } else {
            $admin1->update(['password' => bcrypt('Admin@12345')]);
        }
        $admin1->assignRole($adminRole);

        $admin2 = \App\Models\User::firstWhere('email', 'k2k-admin@gmail.com');
        if (!$admin2) {
            $admin2 = \App\Models\User::create([
                'email'        => 'k2k-admin@gmail.com',
                'id'           => (string) \Illuminate\Support\Str::uuid(),
                'first_name'   => 'K2K',
                'last_name'    => 'Admin',
                'password'     => bcrypt('admin123'),
                'status'       => 'active',
                'email_verified_at' => now(),
            ]);
        } else {
            $admin2->update(['password' => bcrypt('admin123')]);
        }
        $admin2->assignRole($adminRole);

        // Consumer user
        $consumer = \App\Models\User::firstOrCreate(
            ['email' => 'customer@kadal.local'],
            [
                'id'           => (string) \Illuminate\Support\Str::uuid(),
                'first_name'   => 'Demo',
                'last_name'    => 'Customer',
                'password'     => bcrypt('Customer@12345'),
                'status'       => 'active',
                'email_verified_at' => now(),
            ]
        );
        $consumer->assignRole($consumerRole);

        // Seed categories and products
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);

        // Seed default serviceable Chennai areas with custom shipping prices
        \App\Models\Area::firstOrCreate(['name' => 'Anna Nagar'],  ['shipping_price' => 10.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Adyar'],       ['shipping_price' => 20.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Velachery'],   ['shipping_price' => 30.00]);
        \App\Models\Area::firstOrCreate(['name' => 'T. Nagar'],    ['shipping_price' => 15.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Mylapore'],    ['shipping_price' => 25.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Nungambakkam'], ['shipping_price' => 18.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Porur'],       ['shipping_price' => 35.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Chromepet'],   ['shipping_price' => 40.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Tambaram'],    ['shipping_price' => 45.00]);
        \App\Models\Area::firstOrCreate(['name' => 'Perambur'],    ['shipping_price' => 22.00]);
    }
}
