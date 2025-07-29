import React from 'react';
import { useForm, router } from '@inertiajs/react';

export default function ProductForm({ product = null, categories }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        price: product?.price || '',
         images: [],
        image_alt: product?.image_alt || '',
        description: product?.description || '',
        category_id: product?.category_id || '',
        subcategory_id: product?.subcategory_id || '',
    });

    const subcategories =
        categories.find(c => c.id == data.category_id)?.subcategories || [];

const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setData(name, files[0]); 
        } else {
            setData(name, value);
        }
    };

const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') {
            for (let i = 0; i < value.length; i++) {
                formData.append('images[]', value[i]);
            }
        } else {
            formData.append(key, value);
        }
    });

    if (product) {
        formData.append('_method', 'PUT'); // method spoofing
        router.post(route('products.update', product.id), formData);
    } else {
        router.post(route('products.store'), formData);
    }
};

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl p-6 bg-white shadow rounded">
            <div className="grid grid-cols-1 gap-4">
                <input
                    type="text"
                    placeholder="Product Name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

                <input
                    type="text"
                    placeholder="Price"
                    name="price"
                    value={data.price}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
    type="file"
    name="images"
    multiple
    onChange={(e) => setData('images', e.target.files)}
    className="border p-2 rounded"
/>
{errors.images && <div className="text-red-500 text-sm">{errors.images}</div>}


                <input
                    type="text"
                    placeholder="Image Alt"
                    name="image_alt"
                    value={data.image_alt}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <textarea
                    placeholder="Description"
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <select
                    name="category_id"
                    value={data.category_id}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select
                    name="subcategory_id"
                    value={data.subcategory_id}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    disabled={!data.category_id}
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
