<?php

namespace Database\Factories;

use App\Models\LeadStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadStatusFactory extends Factory
{
    protected $model = LeadStatus::class;

    public function definition(): array
    {
        $statuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'];

        return [
            'name' => $this->faker->unique()->randomElement($statuses),
        ];
    }
}
