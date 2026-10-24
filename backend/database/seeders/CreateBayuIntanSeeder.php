<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CreateBayuIntanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating couple accounts: Bayu & Intan...');

        // Create Bayu
        $bayu = User::create([
            'name' => 'Bayu',
            'email' => 'bayu@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create Intan
        $intan = User::create([
            'name' => 'Intan',
            'email' => 'intan@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create shared wallet
        $wallet = Wallet::create([
            'name' => 'Tabungan Berdua',
            'balance' => 0,
        ]);

        // Attach both users to the wallet
        $wallet->users()->attach([$bayu->id, $intan->id]);

        $this->command->info('✅ Accounts created successfully!');
        $this->command->info('');
        $this->command->info('--- Bayu ---');
        $this->command->info('Email: bayu@example.com');
        $this->command->info('Password: password');
        $this->command->info('');
        $this->command->info('--- Intan ---');
        $this->command->info('Email: intan@example.com');
        $this->command->info('Password: password');
        $this->command->info('');
        $this->command->info('Shared Wallet: Tabungan Berdua');
    }
}
