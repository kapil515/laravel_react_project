import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function EditProduct({ product, categories = [], onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
        images: product.images || [],
        imageAlt: product.imageAlt || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState(product.images || []);

  
const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'put');
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('description', data.description);
    formData.append('category_id', data.category_id);
    formData.append('subcategory_id', data.subcategory_id);
    formData.append('imageAlt', data.imageAlt);

    selectedFiles.forEach((file) => {
        formData.append('images[]', file);
    });

    // ✅ THIS IS CORRECT USAGE
    router.post(route('products.update', product.id), formData, {
        preserveScroll: true,
        onSuccess: () => {
            console.log("Product updated successfully");
            onClose();
        },
    });
};

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block font-semibold">Name</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Price</label>
                    <input
                        type="number"
                        className="border rounded w-full p-2"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Description</label>
                    <textarea
                        className="border rounded w-full p-2"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Category</label>
                    <select
                        className="border rounded w-full p-2"
                        value={data.category_id}
                        onChange={(e) => {
                            setData('category_id', e.target.value);
                            setData('subcategory_id', '');
                        }}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Subcategory</label>
                    <select
                        className="border rounded w-full p-2"
                        value={data.subcategory_id}
                        onChange={(e) => setData('subcategory_id', e.target.value)}
                        disabled={!data.category_id}
                    >
                        <option value="">Select Subcategory</option>
                        {categories
                            .find((cat) => cat.id === Number(data.category_id))
                            ?.subcategories?.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Image Alt Text</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={data.imageAlt}
                        onChange={(e) => setData('imageAlt', e.target.value)}
                    />
                    {errors.imageAlt && <p className="text-red-500 text-sm">{errors.imageAlt}</p>}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Images</label>
                    <input
                        type="file"
                        multiple
                        className="w-full"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setSelectedFiles(files);
                            setPreviewImages(files.map(file => URL.createObjectURL(file)));
                        }}
                    />
                    {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                </div>

                {previewImages.length > 0 ? (
                    <div className="grid grid-cols-5 gap-4 mb-4">
                        {previewImages.map((img, index) => (
                            <div key={index} className="w-[50px] h-[50px] border rounded overflow-hidden">
                                <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-4 mb-4">
                        {data.images.map((img, index) => (
                            <div key={index} className="w-[50px] h-[50px] border rounded overflow-hidden">
                                <img src={`/storage/${img}`} alt={`Image ${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update
                </button>
            </form>
        </div>
    );
}
