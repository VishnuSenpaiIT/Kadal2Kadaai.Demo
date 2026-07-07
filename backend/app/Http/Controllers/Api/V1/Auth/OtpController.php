<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\ConsumerProfile;
use App\Models\User;
use App\Services\Auth\OtpService;
use App\Services\Auth\TokenService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OtpController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected OtpService $otpService,
        protected TokenService $tokenService
    ) {}

    public function send(SendOtpRequest $request): JsonResponse
    {
        $purpose = $request->input('purpose', 'login');

        // In production, you would actually send SMS here via NotificationService
        $this->otpService->generateOtp($request->phone, $purpose);

        return $this->success(null, 'OTP sent successfully to ' . $request->phone);
    }

    /**
     * Verify OTP and return a token.
     * Fix 6: Uses contact_number (correct DB column), creates ConsumerProfile,
     *        assigns required first_name so the user account is not broken.
     */
    public function verify(VerifyOtpRequest $request): JsonResponse
    {
        $purpose = $request->input('purpose', 'login');

        $isValid = $this->otpService->verifyOtp($request->phone, $request->otp_code, $purpose);

        if (!$isValid) {
            return $this->error('Invalid or expired OTP', 400, null, 'AUTH_003');
        }

        // Fix 6: Use contact_number (correct column), provide a default first_name
        // to prevent broken account state.
        $user = DB::transaction(function () use ($request) {
            $user = User::firstOrCreate(
                ['contact_number' => $request->phone],  // Fix: was 'phone' which doesn't exist
                [
                    'first_name' => 'User',              // Fix: first_name is required by app logic
                    'status'     => 'active',
                ]
            );

            if (!$user->phone_verified_at) {
                $user->update(['phone_verified_at' => now()]);
            }

            // Fix 6: Create ConsumerProfile if missing to avoid null profile errors
            if (!$user->consumerProfile) {
                ConsumerProfile::create(['user_id' => $user->id]);
            }

            if (!$user->hasRole('consumer')) {
                $user->assignRole('consumer');
            }

            return $user;
        });

        $token = $this->tokenService->createTokenForUser($user);

        return $this->success([
            'user'  => new UserResource($user),
            'token' => $token,
        ], 'OTP verified successfully');
    }
}
