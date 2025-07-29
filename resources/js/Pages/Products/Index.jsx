import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function ProductIndex({ products = { data: [] }, categories = [], users = [], filters = {} }) {
    const { get } = useForm();
    const { auth } = usePage().props;

    const handleFilterChange = (e) => {
        get(route('products.index'), {
            preserveState: true,
            replace: true,
            only: ['products'],
            data: {
                ...filters,
                [e.target.name]: e.target.value,
            },
        });
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Products</h1>
                <Link
                    href={route('products.create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Create Product
                </Link>
            </div>

            <div className="flex gap-4 mb-4">
                <select
                    name="category_id"
                    value={filters.category_id || ''}
                    onChange={handleFilterChange}
                    className="border  py-2 rounded"
                >
                    <option value="">Filter by Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {auth.user.role === 'admin' && (
                    <select
                        name="user_id"
                        value={filters.user_id || ''}
                        onChange={handleFilterChange}
                        className="border py-2 rounded"
                    >
                        <option value="">Filter by User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">User</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.data.length > 0 ? (
                        products.data.map((product) => (
                            <tr key={product.id}>
                                <td className="p-2 border">{product.name}</td>
                                <td className="p-2 border">₹{product.price}</td>
                                <td className="p-2 border">{product.category?.name || '-'}</td>
                                <td className="p-2 border">{product.user?.name || '-'}</td>
                                <td className="p-2 border space-x-2">
                                    <Link href={route('products.edit', product.id)} className="text-blue-600">
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('products.destroy', product.id)}
                                        method="delete"
                                        as="button"
                                        className="text-red-600"
                                    >
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center p-4">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4">
                <div className="flex space-x-2">
                    {products.links?.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 border rounded ${
                                link.active ? 'bg-blue-500 text-white' : 'text-gray-700'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
