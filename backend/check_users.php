<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = DB::table('users')->select('email', 'status')->get();
foreach ($users as $u) {
    echo $u->email . ' | ' . $u->status . PHP_EOL;
}

// Also check roles
$roles = DB::table('roles')->select('name')->get();
echo PHP_EOL . "Roles: ";
foreach ($roles as $r) {
    echo $r->name . ', ';
}
echo PHP_EOL;

// Check model_has_roles
$assignments = DB::table('model_has_roles')
    ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
    ->join('users', 'users.id', '=', 'model_has_roles.model_id')
    ->select('users.email', 'roles.name as role')
    ->get();
echo PHP_EOL . "Role Assignments:" . PHP_EOL;
foreach ($assignments as $a) {
    echo $a->email . ' => ' . $a->role . PHP_EOL;
}
