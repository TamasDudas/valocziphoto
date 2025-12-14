<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ImageResource extends JsonResource
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
            'user_id' => $this->user_id,
            'filename' => $this->filename,
            'original_filename' => $this->original_filename,
            'path' => $this->path,
            'size' => $this->size,
            'mime_type' => $this->mime_type,
            'width' => $this->width,
            'height' => $this->height,
            'alt_text' => $this->alt_text,
            'categories' => $this->categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            }),
            'image_url' => $this->path ? Storage::url($this->path) : null,
        ];
    }
}
