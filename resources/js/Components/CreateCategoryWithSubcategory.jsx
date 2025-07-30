import { useForm, usePage } from '@inertiajs/react';

export default function CreateCategoryWithSubcategory({ onClose }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        category: '',
        subcategory: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('categories.with.subcategory'), {
            onSuccess: () => {
                reset(); // ✅ form reset
                onClose(); // ✅ close modal if you want
            }
        });
    };

    return (
        <div>
            {/* ✅ Flash message */}
            {flash.success && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    className="block mb-2 w-full border px-4 py-2"
                />
                {errors.category && <div className="text-red-500 text-sm">{errors.category}</div>}

                <input
                    type="text"
                    placeholder="Subcategory"
                    value={data.subcategory}
                    onChange={(e) => setData('subcategory', e.target.value)}
                    className="block mb-2 w-full border px-4 py-2"
                />
                {errors.subcategory && <div className="text-red-500 text-sm">{errors.subcategory}</div>}

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-green-700 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
