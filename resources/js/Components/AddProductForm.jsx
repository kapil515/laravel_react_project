import { useForm, router  } from '@inertiajs/react';
import { useRef } from 'react';


export default function AddProductForm({ onClose }) {
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        image_alt: '',
        images: [],
        description: '',
        colors: [],
        sizes: [],
        highlights: [],
        details: '',
        reviews_average: null,
        reviews_total_count: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('image_alt', data.image_alt);
        formData.append('description', data.description);
        formData.append('details', data.details);
        formData.append('reviews_average', data.reviews_average);
        formData.append('reviews_total_count', data.reviews_total_count);

        data.images.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post(route('products.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                if (typeof onClose === 'function') {
                    onClose(); 
                }
            }
        });


        post(route('products.store'), {
            data: formData,
            contentType: false,
            processData: false,
            onSuccess: () => {
                alert('Product added successfully!');
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                reset();
            },
        });
    };

    const handleImageChange = (e) => {
        setData('images', Array.from(e.target.files));
    };

    return (
        <div className=" py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Add New Product</h2>
                <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-lg border p-6 bg-white" encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Name</label>
                        <input
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Price</label>
                        <input
                            name="price"
                            type='number'
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Image Alt Text</label>
                        <input
                            name="image_alt"
                            value={data.image_alt}
                            onChange={(e) => setData('image_alt', e.target.value)}
                            className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                        />
                        {errors.image_alt && <p className="text-red-500 text-sm mt-1">{errors.image_alt}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Upload Images (Multiple)</label>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                        />
                        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Description</label>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="block w-full rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}