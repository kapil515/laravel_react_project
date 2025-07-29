

import React from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ products, categories, auth }) {
    const { data, setData } = React.useState({
        category_id: '',
        subcategory_id: ''
    });

    function handleFilter(e) {
        setData({ ...data, [e.target.name]: e.target.value });
        router.get(route('products.index'), { ...data, [e.target.name]: e.target.value }, { preserveState: true });
    }

    return (
        <AuthLayout auth={auth}>
            <Head title="All Products" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">All Products</h1>
                    <Link
                        href={route('products.create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        + Create Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <select
                        name="category_id"
                        value={data.category_id}
                        onChange={handleFilter}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Product Table */}
                <div className="overflow-auto">
                    <table className="w-full table-auto text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Category</th>
                                <th className="border p-2">User</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map(product => (
                                <tr key={product.id}>
                                    <td className="border p-2">{product.name}</td>
                                    <td className="border p-2">{product.price}</td>
                                    <td className="border p-2">{product.category?.name}</td>
                                    <td className="border p-2">{product.user?.name}</td>
                                    <td className="border p-2 space-x-2">
                                        <Link
                                            href={route('products.edit', product.id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure?')) {
                                                    router.delete(route('products.destroy', product.id));
                                                }
                                            }}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center gap-2">
                    {products.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => router.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 border rounded ${link.active ? 'bg-blue-600 text-white' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </AuthLayout>
    );
}
