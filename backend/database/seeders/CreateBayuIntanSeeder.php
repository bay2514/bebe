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
        $bayu = User::firstOrCreate(
            ['email' => 'bayu@example.com'],
            [
                'name' => 'Bayu',
                'password' => Hash::make('password'),
            ]
        );

        // Create Intan
        $intan = User::firstOrCreate(
            ['email' => 'intan@example.com'],
            [
                'name' => 'Intan',
                'password' => Hash::make('password'),
            ]
        );

        // Create shared wallet
        $wallet = Wallet::firstOrCreate(
            ['name' => 'Tabungan Berdua'],
            ['balance' => 0]
        );

        // Attach both users to the wallet
        $wallet->users()->syncWithoutDetaching([$bayu->id, $intan->id]);

        $this->command->info('✅ Accounts created successfully!');
    }
}
