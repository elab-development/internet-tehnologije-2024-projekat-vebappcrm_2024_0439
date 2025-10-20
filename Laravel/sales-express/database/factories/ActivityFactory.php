<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\User;
use App\Models\CompanyInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        $assignedTo = User::inRandomOrder()->first();
        $lead = Lead::inRandomOrder()->first();
        $companyId = $lead?->owningcompany ?? CompanyInfo::inRandomOrder()->first()?->id ?? 1;

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'date' => $this->faker->date(),
            'status' => $this->faker->numberBetween(0, 2),
            'assigned_to' => $assignedTo?->id ?? User::factory(),
            'owninglead' => $lead?->id,
            'owningopportunity' => null,
            'owningcompany' => $companyId,
        ];
    }
}
