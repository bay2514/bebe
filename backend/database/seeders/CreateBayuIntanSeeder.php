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
        $this->command->info('Creating/updating couple accounts: Bayu & Intan...');

        // Update or create Bayu
        $bayu = User::updateOrCreate(
            ['name' => 'Bayu'],
            [
                'email' => 'bayu@bebe.com',
                'password' => Hash::make('211223'),
            ]
        );

        // Update or create Intan
        $intan = User::updateOrCreate(
            ['name' => 'Intan'],
            [
                'email' => 'intan@bebe.com',
                'password' => Hash::make('211223'),
            ]
        );

        // Create shared wallet if not exists
        $wallet = Wallet::firstOrCreate(
            ['name' => 'Tabungan Berdua'],
            ['balance' => 0]
        );

        // Attach both users to the wallet without detaching existing associations
        $wallet->users()->syncWithoutDetaching([$bayu->id, $intan->id]);

        $this->command->info('✅ Accounts created/updated successfully!');
        $this->command->info('');
        $this->command->info('--- Bayu ---');
        $this->command->info('Email: bayu@bebe.com');
        $this->command->info('Password: 211223');
        $this->command->info('');
        $this->command->info('--- Intan ---');
        $this->command->info('Email: intan@bebe.com');
        $this->command->info('Password: 211223');
        $this->command->info('');
        $this->command->info('Shared Wallet: Tabungan Berdua');
    }
}
