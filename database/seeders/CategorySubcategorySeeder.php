<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;


class CategorySubcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $categories = [
            'Electronics' => [
                'Mobile Phones',
                'Laptops',
                'Tablets',
                'Headphones',
                'Smart Watches',
            ],
            'Fashion' => [
                'Men\'s Clothing',
                'Women\'s Clothing',
                'Kids\' Wear',
                'Footwear',
                'Accessories',
            ],
            'Home & Kitchen' => [
                'Furniture',
                'Kitchen Appliances',
                'Home Decor',
                'Storage & Organization',
                'Cleaning Supplies',
            ],
            'Beauty & Personal Care' => [
                'Skin Care',
                'Hair Care',
                'Makeup',
                'Fragrances',
                'Personal Hygiene',
            ],
            'Toys & Games' => [
                'Action Figures',
                'Educational Toys',
                'Board Games',
                'Outdoor Play',
                'Dolls & Plushies',
            ],
        ];

        foreach ($categories as $categoryName => $subcategories) {
            $category = Category::create([
                'name' => $categoryName
            ]);

            foreach ($subcategories as $subName) {
                Subcategory::create([
                    'name' => $subName,
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}