<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Redemption;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class RedemptionController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $wallet = $user->wallets()->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet tidak ditemukan'], 404);
        }

        $status = request('status');
        $page = request('page', 1);
        $limit = request('limit', 20);

        $query = Redemption::where('wallet_id', $wallet->id);

        if ($status) {
            $query->where('status', $status);
        }

        $redemptions = $query->orderBy('used_at', 'desc')->forPage($page, $limit)->get();

        $total = Redemption::where('wallet_id', $wallet->id)->count();

        return response()->json([
            'data' => $redemptions->map(fn($r) => [
                'id' => $r->id,
                'status' => $r->status,
                'price_snapshot' => $r->price_snapshot,
                'used_at' => $r->used_at?->toIso8601String(),
                'created_at' => $r->created_at->toIso8601String(),
                'voucher' => [
                    'id' => $r->voucher->id ?? null,
                    'title' => $r->voucher->title ?? null,
                    'emoji' => $r->voucher->emoji ?? null,
                ],
                'user' => $r->user ? ['id' => $r->user->id, 'name' => $r->user->name] : null,
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

        $redemption = Redemption::where('wallet_id', $wallet->id)->with('voucher')->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $redemption->id,
                'status' => $redemption->status,
                'price_snapshot' => $redemption->price_snapshot,
                'used_at' => $redemption->used_at?->toIso8601String(),
                'created_at' => $redemption->created_at->toIso8601String(),
                'voucher' => [
                    'id' => $redemption->voucher->id ?? null,
                    'title' => $redemption->voucher->title ?? null,
                    'emoji' => $redemption->voucher->emoji ?? null,
                    'price' => $redemption->voucher->price ?? null,
                ],
                'transaction' => $redemption->transaction ? [
                    'id' => $redemption->transaction->id,
                    'type' => $redemption->transaction->type,
                    'amount' => $redemption->transaction->amount,
                    'direction' => $redemption->transaction->direction,
                    'note' => $redemption->transaction->note,
                ] : null,
            ],
        ]);
    }
}
