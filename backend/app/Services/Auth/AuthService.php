<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class AuthService
{
    public function registerUser(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'password' => isset($data['password']) ? Hash::make($data['password']) : null,
            'status' => 'active', // In a real app this might be 'pending' pending OTP
        ]);

        $user->assignRole('consumer'); // Default role

        event(new Registered($user));

        return $user;
    }

    public function loginWithEmail(string $email, string $password): ?User
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        return $user;
    }
}
