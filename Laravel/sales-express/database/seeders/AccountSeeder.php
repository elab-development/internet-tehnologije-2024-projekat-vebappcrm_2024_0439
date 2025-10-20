<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                // Ensure there are companies
        if (CompanyInfo::count() == 0) {
            CompanyInfo::factory()->count(3)->create();
        }

        // Create accounts
        $accounts = Account::factory()->count(5)->create();

        // Create contacts for each account
        foreach ($accounts as $account) {
            Contact::factory()->count(3)->create([
                'account' => $account->id,
                'owningcompany' => $account->owningcompany,
            ]);
        }
    }
}
