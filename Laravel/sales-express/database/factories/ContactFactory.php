<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\Account;
use App\Models\CompanyInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition(): array
    {
        $account = Account::inRandomOrder()->first();
        $companyId = $account ? $account->owningcompany : CompanyInfo::inRandomOrder()->first()?->id ?? 1;

        return [
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'title' => $this->faker->jobTitle(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'mobile' => $this->faker->phoneNumber(),
            'account' => $account?->id ?? Account::factory(),
            'owningcompany' => $companyId,
        ];
    }
}
