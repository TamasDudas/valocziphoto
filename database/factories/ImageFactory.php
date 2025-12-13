<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'filename' => $this->faker->word . '.jpg',
            'original_filename' => $this->faker->word . '.jpg',
            'versions' => json_encode(['thumbnail', 'medium', 'large']),
            'size' => $this->faker->numberBetween(1000, 1000000),
            'mime_type' => 'image/jpeg',
            'width' => $this->faker->numberBetween(100, 2000),
            'height' => $this->faker->numberBetween(100, 2000),
            'alt_text' => $this->faker->sentence,
        ];
    }
}