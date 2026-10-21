<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $wallet = $user->wallets()->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet tidak ditemukan'], 404);
        }

        $type = request('type');
        $direction = request('direction');
        $page = request('page', 1);
        $limit = request('limit', 20);

        $query = Transaction::where('wallet_id', $wallet->id);

        if ($type) {
            $query->where('type', $type);
        }

        if ($direction) {
            $query->where('direction', $direction);
        }

        $transactions = $query->orderBy('occurred_at', 'desc')->forPage($page, $limit)->get();

        $total = Transaction::where('wallet_id', $wallet->id)->count();

        return response()->json([
            'data' => $transactions->map(fn($t) => [
                'id' => $t->id,
                'type' => $t->type,
                'amount' => $t->amount,
                'direction' => $t->direction,
                'note' => $t->note,
                'balance_after' => $t->balance_after,
                'occurred_at' => $t->occurred_at->toIso8601String(),
                'user' => $t->user ? ['id' => $t->user->id, 'name' => $t->user->name] : null,
                'voucher' => $t->voucher ? [
                    'id' => $t->voucher->id,
                    'title' => $t->voucher->title,
                    'emoji' => $t->voucher->emoji,
                ] : null,
            ]),
            'meta' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => (int) ceil($total / $limit),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = Auth::user();
        $wallet = $user->wallets()->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet tidak ditemukan'], 404);
        }

        $transaction = Transaction::where('wallet_id', $wallet->id)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'amount' => $transaction->amount,
                'direction' => $transaction->direction,
                'note' => $transaction->note,
                'balance_after' => $transaction->balance_after,
                'occurred_at' => $transaction->occurred_at->toIso8601String(),
                'user' => $transaction->user ? ['id' => $transaction->user->id, 'name' => $transaction->user->name] : null,
                'voucher' => $transaction->voucher ? [
                    'id' => $transaction->voucher->id,
                    'title' => $transaction->voucher->title,
                    'emoji' => $transaction->voucher->emoji,
                ] : null,
            ],
        ]);
    }
}
