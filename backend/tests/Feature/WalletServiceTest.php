<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Voucher;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Exception;

class WalletServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_deposit_adds_balance_and_creates_ledger(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::create(['name' => 'Test Wallet', 'balance' => 0]);
        $wallet->users()->attach($user->id);

        $service = new WalletService();
        $transaction = $service->deposit($wallet, $user->id, 50000, 'Tabungan awal');

        $this->assertEquals(50000, $wallet->fresh()->balance);
        $this->assertEquals(50000, $transaction->balance_after);
        $this->assertEquals('deposit', $transaction->type);
        $this->assertEquals('in', $transaction->direction);
        $this->assertEquals(50000, $transaction->amount);
    }

    public function test_redeem_deducts_balance_when_sufficient(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::create(['name' => 'Test Wallet', 'balance' => 100000]);
        $wallet->users()->attach($user->id);

        $voucher = Voucher::create([
            'title' => 'Nonton Bioskop',
            'category' => 'Hiburan',
            'price' => 75000,
        ]);

        $service = new WalletService();
        $redemption = $service->redeem($wallet, $user->id, $voucher);

        $this->assertEquals(25000, $wallet->fresh()->balance);
        $this->assertEquals('ready', $redemption->status);
        $this->assertEquals(75000, $redemption->price_snapshot);
        $this->assertNotNull($redemption->transaction_id);
    }

    public function test_redeem_fails_when_balance_insufficient(): void
    {
        $this->expectException(Exception::class);

        $user = User::factory()->create();
        $wallet = Wallet::create(['name' => 'Test Wallet', 'balance' => 20000]);
        $wallet->users()->attach($user->id);

        $voucher = Voucher::create([
            'title' => 'Nonton Bioskop',
            'category' => 'Hiburan',
            'price' => 75000,
        ]);

        $service = new WalletService();
        $service->redeem($wallet, $user->id, $voucher);
    }
}
