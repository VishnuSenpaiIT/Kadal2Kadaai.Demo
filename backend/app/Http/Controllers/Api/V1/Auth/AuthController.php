<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use App\Services\Auth\TokenService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $authService,
        protected TokenService $tokenService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->registerUser($request->validated());
        $token = $this->tokenService->createTokenForUser($user);

        return $this->created([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'User registered successfully');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->authService->loginWithEmail($request->email, $request->password);

        if (!$user) {
            return $this->error('Invalid email or password', 401, null, 'AUTH_001');
        }

        if (!$user->isActive()) {
            return $this->error('Account is inactive or suspended', 403, null, 'AUTH_004');
        }

        $token = $this->tokenService->createTokenForUser($user);

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Logged in successfully');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->tokenService->revokeCurrentToken($request->user());

        return $this->success(null, 'Logged out successfully');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(
            new UserResource($request->user()),
            'User retrieved successfully'
        );
    }
}
