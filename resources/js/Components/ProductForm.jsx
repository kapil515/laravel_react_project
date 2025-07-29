

import React from 'react';
import { useForm, router } from '@inertiajs/react';

export default function ProductForm({ product = null, categories }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        price: product?.price || '',
        image_src: product?.image_src || '',
        image_alt: product?.image_alt || '',
        description: product?.description || '',
        category_id: product?.category_id || '',
        subcategory_id: product?.subcategory_id || '',
    });

    const subcategories =
        categories.find(c => c.id == data.category_id)?.subcategories || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (product) {
            put(route('products.update', product.id));
        } else {
            post(route('products.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl p-6 bg-white shadow rounded">
            <div className="grid grid-cols-1 gap-4">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="border p-2 rounded"
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

                <input
                    type="text"
                    placeholder="Price"
                    value={data.price}
                    onChange={e => setData('price', e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Image URL"
                    value={data.image_src}
                    onChange={e => setData('image_src', e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Image Alt"
                    value={data.image_alt}
                    onChange={e => setData('image_alt', e.target.value)}
                    className="border p-2 rounded"
                />

                <textarea
                    placeholder="Description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="border p-2 rounded"
                />

                <select
                    value={data.category_id}
                    onChange={e => setData('category_id', e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select
                    value={data.subcategory_id}
                    onChange={e => setData('subcategory_id', e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    {product ? 'Update' : 'Create'} Product
                </button>
            </div>
        </form>
    );
}
