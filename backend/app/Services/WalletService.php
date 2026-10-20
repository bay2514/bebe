<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\Redemption;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Exception;

class WalletService
{
    public function deposit(Wallet $wallet, int $userId, int $amount, ?string $note = null): Transaction
    {
        if ($amount <= 0) {
            throw new Exception('Nominal deposit harus lebih dari 0.');
        }

        return DB::transaction(function () use ($wallet, $userId, $amount, $note) {
            // Lock wallet for update
            $lockedWallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            $newBalance = $lockedWallet->balance + $amount;
            $lockedWallet->balance = $newBalance;
            $lockedWallet->save();

            $transaction = Transaction::create([
                'wallet_id' => $lockedWallet->id,
                'user_id' => $userId,
                'type' => 'deposit',
                'amount' => $amount,
                'direction' => 'in',
                'note' => $note,
                'balance_after' => $newBalance,
                'occurred_at' => now(),
            ]);

            return $transaction;
        });
    }

    public function redeem(Wallet $wallet, int $userId, Voucher $voucher): Redemption
    {
        return DB::transaction(function () use ($wallet, $userId, $voucher) {
            $lockedWallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            if ($lockedWallet->balance < $voucher->price) {
                throw new Exception('Saldo belum cukup untuk meredeem voucher ini.');
            }

            $newBalance = $lockedWallet->balance - $voucher->price;
            $lockedWallet->balance = $newBalance;
            $lockedWallet->save();

            $transaction = Transaction::create([
                'wallet_id' => $lockedWallet->id,
                'user_id' => $userId,
                'type' => 'redeem',
                'amount' => $voucher->price,
                'direction' => 'out',
                'voucher_id' => $voucher->id,
                'note' => 'Redeem voucher: ' . $voucher->title,
                'balance_after' => $newBalance,
                'occurred_at' => now(),
            ]);

            $redemption = Redemption::create([
                'wallet_id' => $lockedWallet->id,
                'user_id' => $userId,
                'voucher_id' => $voucher->id,
                'transaction_id' => $transaction->id,
                'status' => 'ready',
                'price_snapshot' => $voucher->price,
            ]);

            return $redemption;
        });
    }

    public function refund(Wallet $wallet, int $userId, int $amount, ?string $note = null): Transaction
    {
        if ($amount <= 0) {
            throw new Exception('Nominal refund harus lebih dari 0.');
        }

        return DB::transaction(function () use ($wallet, $userId, $amount, $note) {
            $lockedWallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            $newBalance = $lockedWallet->balance + $amount;
            $lockedWallet->balance = $newBalance;
            $lockedWallet->save();

            $transaction = Transaction::create([
                'wallet_id' => $lockedWallet->id,
                'user_id' => $userId,
                'type' => 'refund',
                'amount' => $amount,
                'direction' => 'in',
                'note' => $note,
                'balance_after' => $newBalance,
                'occurred_at' => now(),
            ]);

            return $transaction;
        });
    }
}
