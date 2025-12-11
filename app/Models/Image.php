<?php

namespace App\Models;

use App\Enums\ImagesSizeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Image extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\ImageFactory> */
    use HasFactory;
    use InteractsWithMedia;

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


    public function Categories()
    {
        return $this->belongsToMany(Category::class);
    }


    public function User()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Register media conversions for image resizing.
     * Creates thumbnail, medium, and large versions based on ImagesSizeEnum.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(ImagesSizeEnum::THUMBNAIL->width())
            ->height(ImagesSizeEnum::THUMBNAIL->width());

        $this->addMediaConversion('medium')
            ->width(ImagesSizeEnum::MEDIUM->width())
            ->height(ImagesSizeEnum::MEDIUM->width());

        $this->addMediaConversion('large')
            ->width(ImagesSizeEnum::LARGE->width())
            ->height(ImagesSizeEnum::LARGE->width());
    }

    /**
     * Get the picture sources for the <picture> tag based on media conversions.
     * Returns an array of srcset and media queries for responsive images.
     */
    protected function getPictureSourcesAttribute(): array
    {
        $sources = [];
        foreach (ImagesSizeEnum::cases() as $size) {
            $url = $this->getFirstMediaUrl('images', $size->value);
            if ($url) {
                $sources[] = [
                    'srcset' => $url,
                    'media' => "(max-width: {$size->width()}px)",
                ];
            }
        }
        return $sources;
    }

    public function casts(): array
    {
        return [
            'versions' => 'array',
        ];
    }
}
