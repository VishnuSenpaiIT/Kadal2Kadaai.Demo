<?php

declare(strict_types=1);

namespace App\Services\Auth;

use Illuminate\Support\Facades\DB;

class AuditLogService
{
    public function log(string $userId, string $action, string $description, ?string $ipAddress = null, ?string $userAgent = null): void
    {
        DB::table('audit_logs')->insert([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
