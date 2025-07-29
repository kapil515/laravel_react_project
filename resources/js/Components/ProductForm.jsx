
import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function ProductForm({ product = {}, categories = [], subcategories = [], onSuccess }) {
    const fileInputRef = useRef(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product.name || '',
        price: product.price || '',
        image_alt: product.image_alt || '',
        image_src: product.image_src || '',
        description: product.description || '',
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = product.id
            ? put(route('products.update', product.id), { onSuccess })
            : post(route('products.store'), { onSuccess });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.name && <div className="text-red-600">{errors.name}</div>}
            </div>

            <div>
                <label>Price</label>
                <input
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.price && <div className="text-red-600">{errors.price}</div>}
            </div>

            <div>
                <label>Category</label>
                <select
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {errors.category_id && <div className="text-red-600">{errors.category_id}</div>}
            </div>

            <div>
                <label>Subcategory</label>
                <select
                    value={data.subcategory_id}
                    onChange={(e) => setData('subcategory_id', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">-- Select Subcategory --</option>
                    {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
                {errors.subcategory_id && <div className="text-red-600">{errors.subcategory_id}</div>}
            </div>

            <div>
                <label>Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.description && <div className="text-red-600">{errors.description}</div>}
            </div>

            <div>
                <label>Image Alt Text</label>
                <input
                    type="text"
                    value={data.image_alt}
                    onChange={(e) => setData('image_alt', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={processing}
            >
                {product.id ? 'Update' : 'Create'} Product
            </button>
        </form>
    );
}
