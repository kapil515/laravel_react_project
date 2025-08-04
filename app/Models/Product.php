<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $timestamps = true;
    
    protected $fillable = [
        'name', 'price', 'image_src', 'image_alt', 'description', 'images', 'colors', 'sizes','status',
        'highlights', 'details', 'reviews_average', 'reviews_total_count', 'category_id', 'subcategory_id',
    ];

    protected $casts = [
        'images' => 'array',
        'colors' => 'array',
        'sizes' => 'array',
        'highlights' => 'array',
    ];

     public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }
}
