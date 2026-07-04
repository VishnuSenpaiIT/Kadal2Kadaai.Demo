<?php

use App\Models\User;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

$consumerRole = Role::firstOrCreate(['name' => 'consumer', 'guard_name' => 'web']);

$customers = [
    [
        'email'      => 'john@kadal.local',
        'first_name' => 'John',
        'last_name'  => 'Doe',
        'password'   => bcrypt('Password123'),
    ],
    [
        'email'      => 'jane@kadal.local',
        'first_name' => 'Jane',
        'last_name'  => 'Smith',
        'password'   => bcrypt('Password123'),
    ],
    [
        'email'      => 'mike@kadal.local',
        'first_name' => 'Mike',
        'last_name'  => 'Johnson',
        'password'   => bcrypt('Password123'),
    ]
];

foreach ($customers as $customerData) {
    $user = User::firstWhere('email', $customerData['email']);
    if (!$user) {
        $user = User::create([
            'id'                => (string) Str::uuid(),
            'first_name'        => $customerData['first_name'],
            'last_name'         => $customerData['last_name'],
            'email'             => $customerData['email'],
            'password'          => $customerData['password'],
            'status'            => 'active',
            'email_verified_at' => now(),
        ]);
        echo "Created customer: {$customerData['email']}\n";
    } else {
        echo "Customer already exists: {$customerData['email']}\n";
    }
    $user->assignRole($consumerRole);
}
echo "Done.\n";
