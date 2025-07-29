import { useForm } from '@inertiajs/react';

export default function EditProduct({ product, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        price: product.price,
        description: product.description,
        image: null,
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Update success");
                onClose();
            },
        });

    };


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block">Name</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <label className="block">Price</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div className="mb-4">
                    <label className="block">Description</label>
                    <textarea
                        className="border rounded w-full p-2"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="mb-4">
                    <label className="block">Image</label>
                    <input
                        type="file"
                        className="w-full"
                        onChange={(e) => setData('image', e.target.files[0])}
                    />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                </div>

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
