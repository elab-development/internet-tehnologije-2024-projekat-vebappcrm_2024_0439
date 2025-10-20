<?php

namespace Database\Factories;

use App\Models\CompanyInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyInfoFactory extends Factory
{
    protected $model = CompanyInfo::class;

    public function definition(): array
    {
        return [
            'imgpath' => 'images/company/' . $this->faker->image('public/images/company', 400, 300, null, false),
            'name' => $this->faker->company(),
            'description' => $this->faker->catchPhrase(),
            'address' => $this->faker->address(),
        ];
    }
}