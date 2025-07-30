<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'price', 'image_src', 'image_alt', 'description', 'images', 'colors', 'sizes',
        'highlights', 'details', 'reviews_average', 'reviews_total_count',
    ];

    protected $casts = [
        'images' => 'array',
        'colors' => 'array',
        'sizes' => 'array',
        'highlights' => 'array',
    ];

 
    //  public function category()
    // {
    //     return $this->belongsTo(Category::class);
    // }

    // public function subcategory()
    // {
    //     return $this->belongsTo(Subcategory::class);
    // }
}
