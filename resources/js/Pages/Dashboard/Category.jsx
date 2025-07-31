import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ categories }) {
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        category_id: ''
    });

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => reset('name')
        });
    };

    const handleSubcategorySubmit = (e) => {
        e.preventDefault();
        post(route('admin.subcategories.store'), {
            onSuccess: () => reset('name', 'category_id')
        });
    };

    const handleDeleteCategory = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.delete', id));
        }
    };

    const handleDeleteSubcategory = (id) => {
        if (confirm('Are you sure you want to delete this subcategory?')) {
            router.delete(route('admin.subcategories.delete', id));
        }
    };

    return (
        <>
            <Head title="Manage Categories" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Categories & Subcategories</h1>

                {/* Add Category */}
                <form onSubmit={handleCategorySubmit} className="mb-6">
                    <h2 className="font-semibold mb-2">Add Category</h2>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Category name"
                        className="w-[20%]  border p-2 mr-2 rounded"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                </form>

                
                <form onSubmit={handleSubcategorySubmit} className="mb-8">
                    <h2 className="font-semibold mb-2">Add Subcategory</h2>
                    <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className=" w-[20%]  border p-2 mr-2 rounded"
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Subcategory name"
                        className="border w-[20%]   p-2 mr-2 rounded"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                </form>

                {/* Display Categories & Subcategories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map(category => (
                        <div key={category.id} className="border rounded p-4 shadow">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg">{category.name}</h3>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Delete
                                </button>
                            </div>

                            {category.subcategories.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {category.subcategories.map(sub => (
                                        <li key={sub.id} className="flex justify-between items-center">
                                            {sub.name}
                                            <button
                                                onClick={() => handleDeleteSubcategory(sub.id)}
                                                className="text-red-400 hover:underline text-xs ml-2"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No subcategories</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
