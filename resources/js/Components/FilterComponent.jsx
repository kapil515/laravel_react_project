import { useForm } from '@inertiajs/react';

export default function FilterComponent({ categories }) {
    const { data, setData, get } = useForm({
        category_id: '',
        subcategory_id: ''
    });

    function handleFilter() {
        get(route('products.index'), { preserveState: true });
    }

    return (
        <div className="flex gap-4">
            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="border">
                <option value="">All Categories</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <select value={data.subcategory_id} onChange={e => setData('subcategory_id', e.target.value)} className="border">
                <option value="">All Subcategories</option>
                {categories
                    .find(cat => cat.id == data.category_id)?.subcategories
                    ?.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
            </select>

            <button onClick={handleFilter} className="px-4 py-2 bg-blue-600 text-white">Filter</button>
        </div>
    );
}
