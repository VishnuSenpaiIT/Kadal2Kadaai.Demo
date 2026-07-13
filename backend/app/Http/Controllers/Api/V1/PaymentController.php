<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Enums\PaymentStatus;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class PaymentController extends Controller
{
    use ApiResponse;

    /**
     * Verify Razorpay payment signature
     */
    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
        ]);

        if (!env('RAZORPAY_KEY_ID') || !env('RAZORPAY_KEY_SECRET')) {
            return $this->errorResponse('Razorpay is not configured.', 500);
        }

        $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

        try {
            $attributes = array(
                'razorpay_order_id'   => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature'  => $validated['razorpay_signature']
            );

            $api->utility->verifyPaymentSignature($attributes);
        } catch (SignatureVerificationError $e) {
            return $this->errorResponse('Payment verification failed. Invalid signature.', 400);
        }

        // Signature is valid, update payments
        $payments = Payment::where('razorpay_order_id', $validated['razorpay_order_id'])->get();

        if ($payments->isEmpty()) {
            return $this->errorResponse('Payment records not found for this order.', 404);
        }

        foreach ($payments as $payment) {
            $payment->update([
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature'  => $validated['razorpay_signature'],
                'status'              => PaymentStatus::Completed->value,
                'paid_at'             => now(),
            ]);
        }

        return $this->successResponse(null, 'Payment verified successfully');
    }
}
