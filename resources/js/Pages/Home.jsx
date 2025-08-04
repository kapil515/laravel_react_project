// resources/js/Pages/Welcome.jsx
import Banner from '@/Components/Banner';
import Category from '@/Components/Categories';
import Products from '@/Components/Products';
import UserLayout from '@/Layouts/UserLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ products, categories, filters }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(filters.category_id || '');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(filters.subcategory_id || '');
    const [searchQuery, setSearchQuery] = useState(filters.search_query || '');

    // Update useEffect to include searchQuery
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = {};
            if (selectedCategoryId) params.category_id = selectedCategoryId;
            if (selectedSubcategoryId) params.subcategory_id = selectedSubcategoryId;
            if (searchQuery) params.search_query = searchQuery;

            router.get(
                '/',
                params,
                { preserveState: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(handler);
    }, [selectedCategoryId, selectedSubcategoryId, searchQuery]);

    return (
        <>
            <Head title="Home" />
            <UserLayout>
                <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                    <div className="relative flex bg-white min-h-screen flex-col items-center justify-start selection:bg-[#FF2D20] selection:text-white">
                        <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                            <Banner />
                            <Category
                                categories={categories}
                                selectedCategoryId={selectedCategoryId}
                                setSelectedCategoryId={setSelectedCategoryId}
                                selectedSubcategoryId={selectedSubcategoryId}
                                setSelectedSubcategoryId={setSelectedSubcategoryId}
                                setSearchQuery={setSearchQuery}
                            />
                            <Products products={products} />
                        </div>
                    </div>
                </div>
            </UserLayout>
        </>
    );
}