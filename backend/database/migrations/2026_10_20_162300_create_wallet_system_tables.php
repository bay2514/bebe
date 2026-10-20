<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Tabungan Berdua');
            $table->bigInteger('balance')->default(0); // integer rupiah
            $table->timestamps();
        });

        Schema::create('wallet_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category'); // Makan, Hiburan, Belanja, Jalan-jalan, Lainnya
            $table->string('emoji')->default('🎁');
            $table->bigInteger('price'); // integer rupiah
            $table->boolean('is_active')->default(true);
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // deposit, redeem, refund, adjustment
            $table->bigInteger('amount'); // positif integer
            $table->enum('direction', ['in', 'out']);
            $table->foreignId('voucher_id')->nullable()->constrained()->nullOnDelete();
            $table->text('note')->nullable();
            $table->bigInteger('balance_after');
            $table->timestamp('occurred_at');
            $table->timestamps();
        });

        Schema::create('redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('voucher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('ready'); // ready, used
            $table->bigInteger('price_snapshot');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
        });

        Schema::create('idempotency_keys', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->json('response_data');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idempotency_keys');
        Schema::dropIfExists('redemptions');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('wallet_user');
        Schema::dropIfExists('wallets');
    }
};
