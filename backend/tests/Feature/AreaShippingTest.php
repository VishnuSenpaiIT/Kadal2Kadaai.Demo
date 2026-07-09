<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Area;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AreaShippingTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        $adminRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user = User::factory()->create(['status' => 'active']);
        $user->assignRole($adminRole);
        return $user;
    }

    private function createConsumer(): User
    {
        $consumerRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'consumer', 'guard_name' => 'web']);
        $user = User::factory()->create(['status' => 'active']);
        $user->assignRole($consumerRole);
        return $user;
    }

    /**
     * Test admin Area Master CRUD.
     */
    public function test_admin_can_manage_areas(): void
    {
        $admin = $this->createAdmin();
        $token = $admin->createToken('admin_token')->plainTextToken;

        // Create
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/admin/areas', [
                'name' => 'Anna Nagar',
                'shipping_price' => 12.50,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Anna Nagar');
        
        $this->assertEquals(12.50, (float) $response->json('data.shipping_price'));

        $this->assertDatabaseHas('areas', [
            'name' => 'Anna Nagar',
            'shipping_price' => 12.50,
        ]);

        $areaId = $response->json('data.id');

        // Update
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/v1/admin/areas/{$areaId}", [
                'shipping_price' => 15.00,
            ]);

        $response->assertStatus(200);
        $this->assertEquals(15.00, (float) $response->json('data.shipping_price'));

        // List
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/areas');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // Delete
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/admin/areas/{$areaId}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('areas', ['id' => $areaId]);
    }

    /**
     * Test shipping fee calculation.
     */
    public function test_shipping_calculation_with_matched_area(): void
    {
        $consumer = $this->createConsumer();
        $token = $consumer->createToken('token')->plainTextToken;

        // Seed Anna Nagar in areas
        Area::create([
            'name' => 'Anna Nagar',
            'shipping_price' => 10.00,
        ]);

        // Create address with Anna Nagar
        $address = Address::create([
            'user_id' => $consumer->id,
            'full_name' => 'John Doe',
            'mobile_number' => '9876543210',
            'house_flat_number' => '10',
            'street_name' => 'First Street',
            'area_locality' => 'Anna Nagar', // Matches!
            'city' => 'Chennai',
            'district' => 'Chennai',
            'state' => 'Tamil Nadu',
            'pincode' => '600040',
            'latitude' => 13.0827,
            'longitude' => 80.2707,
            'address_type' => 'Home',
        ]);

        // Calculate shipping
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/shipping/calculate', [
                'subtotal' => 200.00,
                'address_id' => $address->id,
            ]);

        $response->assertStatus(200);
        $this->assertEquals(10.00, (float) $response->json('data.shipping_charge'));
        $this->assertEquals(220.00, (float) $response->json('data.total_amount')); // 200 + 10 shipping + 10 tax (5% of 200)
    }

    /**
     * Test shipping fee calculation fallback logic.
     */
    public function test_shipping_calculation_with_unmatched_area_fallback(): void
    {
        $consumer = $this->createConsumer();
        $token = $consumer->createToken('token')->plainTextToken;

        // Create address with unmatched area
        $address = Address::create([
            'user_id' => $consumer->id,
            'full_name' => 'John Doe',
            'mobile_number' => '9876543210',
            'house_flat_number' => '10',
            'street_name' => 'First Street',
            'area_locality' => 'Some Unmatched Locality',
            'city' => 'Chennai',
            'district' => 'Chennai',
            'state' => 'Tamil Nadu',
            'pincode' => '600040',
            'latitude' => 13.0827,
            'longitude' => 80.2707,
            'address_type' => 'Home',
        ]);

        // Calculate shipping (should fallback to flat rate ₹50 since subtotal < 1000)
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/shipping/calculate', [
                'subtotal' => 200.00,
                'address_id' => $address->id,
            ]);

        $response->assertStatus(200);
        $this->assertEquals(50.00, (float) $response->json('data.shipping_charge'));
    }
}
