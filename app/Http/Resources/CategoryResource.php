<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'featured_image_id' => $this->featured_image_id,
            'featured_image' => $this->whenLoaded('featuredImage', function () {
                return $this->featuredImage ? (new ImageResource($this->featuredImage))->resolve() : null;
            }),
            'images' => $this->whenLoaded('images', function () {
                return ImageResource::collection($this->images)->resolve();
            }),
            'images_count' => $this->whenLoaded('images', fn() => $this->images->count()),
        ];
    }
}
