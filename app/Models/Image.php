<?php

namespace App\Models;

use App\Enums\ImagesSizeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    /** @use HasFactory<\Database\Factories\ImageFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'original_filename',
        'versions',
        'size',
        'mime_type',
        'width',
        'height',
        'alt_text',
    ];


    public function Categories(){
        return $this->belongsToMany(Category::class);
    }


    public function User(){
        return $this->belongsTo(User::class);
    }

    protected function getPictureSourcesAttribute(): array
    {
        $sources = [];
        foreach (ImagesSizeEnum::cases() as $size) {
            if (isset($this->versions[$size->value])) {
                $sources[] = [
                    'srcset' => asset($this->versions[$size->value]),
                    'media' => "(max-width: {$size->width()}px)",
                ];
            }
        }
        return $sources;
    }

    public function casts():array
    {
        return [
            'versions' => 'array',
        ];
    }
}
