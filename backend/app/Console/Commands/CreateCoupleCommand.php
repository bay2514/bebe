<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CreateCoupleCommand extends Command
{
    protected $signature = 'couple:create
        {--force-remote : Force run on production environment or non-SQLite database}';

    protected $description = 'Create a couple account with two users and a shared wallet';

    public function handle(): int
    {
        // Protection against accidental production runs
        $isProduction = $this->laravel->environment('production');
        $dbConnection = config('database.default');

        if (($isProduction || $dbConnection !== 'sqlite') && !$this->option('force-remote')) {
            $this->error('PERINGATAN: Command ini ditolak di lingkungan production atau dengan database non-SQLite.');
            $this->error('Jalankan dengan --force-remote jika yakin ingin menjalankan di lingkungan remote.');
            $this->error("APP_ENV: " . ($isProduction ? 'production' : $this->laravel->environment()));
            $this->error("DB_CONNECTION: " . $dbConnection);
            return self::FAILURE;
        }

        $this->info('Membuat akun pasangan baru (Couple Accounts & Shared Wallet)...');

        $walletName = $this->ask('Nama Wallet / Tabungan', 'Tabungan Berdua');

        $this->info('--- Data Partner 1 ---');
        $name1 = $this->ask('Nama Partner 1');
        $email1 = $this->ask('Email Partner 1');
        $password1 = $this->secret('Password Partner 1');

        $this->info('--- Data Partner 2 ---');
        $name2 = $this->ask('Nama Partner 2');
        $email2 = $this->ask('Email Partner 2');
        $password2 = $this->secret('Password Partner 2');

        DB::transaction(function () use ($walletName, $name1, $email1, $password1, $name2, $email2, $password2) {
            $user1 = User::create([
                'name' => $name1,
                'email' => $email1,
                'password' => Hash::make($password1),
            ]);

            $user2 = User::create([
                'name' => $name2,
                'email' => $email2,
                'password' => Hash::make($password2),
            ]);

            $wallet = Wallet::create([
                'name' => $walletName,
                'balance' => 0,
            ]);

            $wallet->users()->attach([$user1->id, $user2->id]);
        });

        $this->info('Berhasil! Akun pasangan dan shared wallet telah dibuat.');
        return self::SUCCESS;
    }
}
