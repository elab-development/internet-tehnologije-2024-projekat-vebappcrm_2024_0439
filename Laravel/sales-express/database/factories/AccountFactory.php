<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\CompanyInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'email' => $this->faker->unique()->companyEmail(),
            'billingaddress' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'website' => $this->faker->domainName(),
            'industry' => $this->faker->industry(),
            'owningcompany' => CompanyInfo::inRandomOrder()->first()?->id ?? 1,
        ];
    }
}
