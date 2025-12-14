<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'user_id',
        'featured_image_id', // Az adatbázisban tárolt ID (pl. 5) - csak egy szám
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->belongsToMany(Image::class);
    }

    /**
     * Featured image kapcsolat
     * 
     * Adatbázis: featured_image_id = 5 (csak egy szám)
     * Használat: $category->featuredImage = teljes Image objektum
     * 
     * Laravel automatikusan összeköti:
     * - belongsTo(Image::class) = "Ez a category TARTOZIK egy Image-hez"
     * - 'featured_image_id' = ez a mező az adatbázisban
     * 
     * Példa:
     * $category->load('featuredImage');
     * $category->featuredImage->image_url; // "/storage/images/uuid.jpg"
     */
    public function featuredImage()
    {
        return $this->belongsTo(Image::class, 'featured_image_id');
    }
}
