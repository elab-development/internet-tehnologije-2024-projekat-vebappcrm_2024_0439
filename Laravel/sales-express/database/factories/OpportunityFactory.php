<?php

namespace Database\Factories;

use App\Models\Opportunity;
use App\Models\Contact;
use App\Models\Account;
use App\Models\User;
use App\Models\CompanyInfo;
use App\Models\OpportunityStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class OpportunityFactory extends Factory
{
    protected $model = Opportunity::class;

    public function definition(): array
    {
        $contact = Contact::inRandomOrder()->first();
        $account = $contact?->account_obj ?? Account::inRandomOrder()->first();
        $owner = User::inRandomOrder()->first();
        $companyId = $account?->owningcompany ?? CompanyInfo::inRandomOrder()->first()?->id ?? 1;
        $status = OpportunityStatus::inRandomOrder()->first()?->id ?? 1;

        return [
            'contact' => $contact?->id ?? Contact::factory(),
            'account' => $account?->id ?? Account::factory(),
            'owner' => $owner?->id ?? User::factory(),
            'title' => $this->faker->catchPhrase(),
            'description' => $this->faker->paragraph(),
            'status' => $status,
            'owningcompany' => $companyId,
        ];
    }
}
