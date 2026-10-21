<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\Transaction;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    public function show(): JsonResponse
    {
        $user = Auth::user();
        $wallet = $user->wallets()->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet tidak ditemukan'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'balance' => $wallet->balance,
                'users' => $wallet->users->map(fn($u) => ['id' => $u->id, 'name' => $u->name]),
                'created_at' => $wallet->created_at->toIso8601String(),
            ],
        ]);
    }

    public function deposit(): JsonResponse
    {
        $validated = request()->validate([
            'amount' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $wallet = $user->wallets()->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet tidak ditemukan'], 404);
        }

        try {
            $service = new WalletService();
            $transaction = $service->deposit($wallet, $user->id, $validated['amount'], $validated['note'] ?? null);

            return response()->json([
                'data' => [
                    'transaction' => [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount,
                        'direction' => $transaction->direction,
                        'note' => $transaction->note,
                        'balance_after' => $transaction->balance_after,
                        'occurred_at' => $transaction->occurred_at->toIso8601String(),
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function refund(): JsonResponse
    {
        $validated = request()->validate([
            'amount' => 'required|integer|min:1',
            'note' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $wallet = $user->wallets()->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet tidak ditemukan'], 404);
        }

        try {
            $service = new WalletService();
            $transaction = $service->refund($wallet, $user->id, $validated['amount'], $validated['note']);

            return response()->json([
                'data' => [
                    'transaction' => [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount,
                        'direction' => $transaction->direction,
                        'note' => $transaction->note,
                        'balance_after' => $transaction->balance_after,
                        'occurred_at' => $transaction->occurred_at->toIso8601String(),
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
