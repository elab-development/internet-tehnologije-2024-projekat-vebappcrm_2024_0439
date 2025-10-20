<?php

namespace Database\Factories;

use App\Models\OpportunityStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class OpportunityStatusFactory extends Factory
{
    protected $model = OpportunityStatus::class;

    public function definition(): array
    {
        $statuses = ['Open', 'In Progress', 'Closed', 'Won', 'Lost'];

        return [
            'name' => $this->faker->unique()->randomElement($statuses),
        ];
    }
}
