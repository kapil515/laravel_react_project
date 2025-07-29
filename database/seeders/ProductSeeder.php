<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;


class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $json = File::get('database/json/products.json');
    $products = collect(json_decode($json));

    $products->each(function ($product) {
        Product::create([
            'category_id' => $product->category_id,
            'subcategory_id' => $product->subcategory_id,
            'name' => $product->name,
            'price' => $product->price,
            'image_alt' => $product->image_alt,
            'description' => $product->description,
            'images' => json_encode($product->images),
            'colors' => json_encode($product->colors),
            'sizes' => json_encode($product->sizes),
            'highlights' => json_encode($product->highlights),
            'details' => $product->details,
            'reviews_average' => $product->reviews_average,
            'reviews_total_count' => $product->reviews_total_count,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'user_id' => $product->user_id,
        ]);
    });
}
}

