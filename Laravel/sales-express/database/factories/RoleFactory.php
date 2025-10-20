<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->jobTitle(),
            'value' => $this->faker->numberBetween(1, 10),
            'type' => $this->faker->numberBetween(0, 2),
        ];
    }
}