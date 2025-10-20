<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\User;
use App\Models\LeadStatus;
use App\Models\CompanyInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        $owner = User::inRandomOrder()->first();
        $company = $owner?->company ?? CompanyInfo::inRandomOrder()->first()?->id ?? 1;
        $status = LeadStatus::inRandomOrder()->first()?->id ?? 1;

        return [
            'name' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'company' => $this->faker->company(),
            'owner' => $owner?->id ?? User::factory(),
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->paragraph(),
            'status' => $status,
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'owningcompany' => $company,
        ];
    }
}
