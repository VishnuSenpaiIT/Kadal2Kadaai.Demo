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
    }
}
