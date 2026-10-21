<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\Redemption;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class VoucherController extends Controller
{
    public function index(): JsonResponse
    {
        $category = request('category');
        $search = request('search');
        $limit = request('limit', 20);

        $query = Voucher::query()->where('is_active', true);

        if ($category) {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        $vouchers = $query->orderBy('price', 'asc')->paginate($limit);

        return response()->json([
            'data' => $vouchers->map(fn($v) => [
                'id' => $v->id,
                'title' => $v->title,
                'description' => $v->description,
                'category' => $v->category,
                'emoji' => $v->emoji,
                'price' => $v->price,
                'is_recurring' => $v->is_recurring,
                'created_at' => $v->created_at->toIso8601String(),
            ]),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $voucher = Voucher::where('is_active', true)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $voucher->id,
                'title' => $voucher->title,
                'description' => $voucher->description,
                'category' => $voucher->category,
                'emoji' => $voucher->emoji,
                'price' => $voucher->price,
                'is_recurring' => $voucher->is_recurring,
                'created_at' => $voucher->created_at->toIso8601String(),
            ],
        ]);
    }

    public function store(): JsonResponse
    {
        $data = request()->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:50',
            'emoji' => 'required|string|max:10',
            'price' => 'required|integer|min:0',
            'is_recurring' => 'boolean',
        ]);

        $voucher = Voucher::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'category' => $data['category'],
            'emoji' => $data['emoji'] ?? '🎁',
            'price' => $data['price'],
            'is_recurring' => $data['is_recurring'] ?? false,
            'is_active' => true,
        ]);

        return response()->json([
            'data' => [
                'id' => $voucher->id,
                'title' => $voucher->title,
                'description' => $voucher->description,
                'category' => $voucher->category,
                'emoji' => $voucher->emoji,
                'price' => $voucher->price,
                'is_recurring' => $voucher->is_recurring,
                'created_at' => $voucher->created_at->toIso8601String(),
            ],
            'message' => 'Voucher berhasil ditambahkan! 🐷'
        ], 201);
    }

    public function redeem(int $id): JsonResponse
    {
        $user = Auth::user();
        $wallet = $user->wallets()->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet tidak ditemukan'], 404);
        }

        $voucher = Voucher::where('is_active', true)->findOrFail($id);

        $service = new WalletService();

        try {
            $redemption = $service->redeem($wallet, $user->id, $voucher);

            return response()->json([
                'data' => [
                    'redemption' => [
                        'id' => $redemption->id,
                        'status' => $redemption->status,
                        'price_snapshot' => $redemption->price_snapshot,
                        'used_at' => $redemption->used_at?->toIso8601String(),
                        'created_at' => $redemption->created_at->toIso8601String(),
                    ],
                    'voucher' => [
                        'id' => $voucher->id,
                        'title' => $voucher->title,
                        'price' => $voucher->price,
                    ],
                    'wallet' => [
                        'id' => $wallet->id,
                        'balance' => $wallet->balance,
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
