import AddProductForm from '@/Components/AddProductForm';
import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import EditProduct from './EditProductForm';
import { usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';


export default function Products({ products, categories, subcategories }) {
    const [editProduct, setEditProduct] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const { props } = usePage();
    const urlParams = new URLSearchParams(window.location.search);
    const [selectedCategoryId, setSelectedCategoryId] = useState(props.filters.category_id || urlParams.get('category_id') || '');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(props.filters.subcategory_id || urlParams.get('subcategory_id') || '');
    const [searchQuery, setSearchQuery] = useState(props.filters.search_query || urlParams.get('search_query') || '');


    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('products.destroy', id));
        }
    };

    const getCategoryName = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : 'N/A';
    };

    const getSubcategoryName = (id) => {
        for (let cat of categories) {
            const sub = cat.subcategories.find(sub => sub.id === id);
            if (sub) return sub.name;
        }
        return 'N/A';
    };

    const handleToggleStatus = (product) => {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';

        router.put(`/products/${product.id}/toggle-status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log(`Product ${product.name} toggled to ${newStatus}`);
            },
        });
    };

    // Handle filter changes and send to backend
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = {};
            if (selectedCategoryId) params.category_id = selectedCategoryId;
            if (selectedSubcategoryId) params.subcategory_id = selectedSubcategoryId;
            if (searchQuery) params.search_query = searchQuery;

            const currentUrlParams = new URLSearchParams(window.location.search);
            const prevUrlParams = new URLSearchParams(props.initialUrl?.split('?')[1] || '');

            const currentPage = currentUrlParams.get('page') ? parseInt(currentUrlParams.get('page')) : 1;
            const prevPage = prevUrlParams.get('page') ? parseInt(prevUrlParams.get('page')) : 1;
            const currentCategoryId = currentUrlParams.get('category_id') || '';
            const currentSubcategoryId = currentUrlParams.get('subcategory_id') || '';
            const currentSearchQuery = currentUrlParams.get('search_query') || '';

            if (
                selectedCategoryId === currentCategoryId &&
                selectedSubcategoryId === currentSubcategoryId &&
                searchQuery === currentSearchQuery &&
                currentPage !== prevPage &&
                currentPage > 1
            ) {
                return;
            }

            if (currentPage > 1) params.page = currentPage;

            router.get(
                '/dashboard/products',
                params,
                { preserveState: true, preserveScroll: true }
            );
        }, 300);
        return () => clearTimeout(handler);
    }, [selectedCategoryId, selectedSubcategoryId, searchQuery]);


    return (
        <>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">All Products List</h1>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-purple-700 text-white px-5 py-2.5 rounded text-sm"
                        >
                            Add New Product
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 max-w-md">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                value={selectedCategoryId}
                                onChange={(e) => {
                                    setSelectedCategoryId(e.target.value);
                                    setSelectedSubcategoryId(''); // Reset subcategory
                                }}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 max-w-md">
                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                                Subcategory
                            </label>
                            <select
                                id="subcategory"
                                value={selectedSubcategoryId}
                                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                                disabled={!selectedCategoryId}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <option value="">All Subcategories</option>
                                {categories
                                    .find((cat) => cat.id === parseInt(selectedCategoryId))?.subcategories.map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.name}
                                        </option>
                                    )) || []}
                            </select>
                        </div>
                        <div className="flex-1 max-w-md">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                                Search Products
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter product name"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            {(selectedCategoryId || selectedSubcategoryId || searchQuery) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategoryId('');
                                        setSelectedSubcategoryId('');
                                        setSearchQuery('');
                                    }}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left text-sm uppercase">
                            <th className="p-3 border">S.No</th>
                            <th className="p-3 border">Image</th>
                            <th className="p-3 border">Category</th>
                            <th className="p-3 border">Subcategory</th>
                            <th className="p-3 border">Product</th>
                            {/* <th className="p-3 border">Discount</th> */}
                            <th className="p-3 border">Active/Inactive</th>
                            <th className="p-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.data.map((product, index) => (
                            <tr key={product.id} className="border-t hover:bg-gray-50 text-sm">
                                <td className="p-3 border">{(products.current_page - 1) * 4 + index + 1}</td>
                                <td className="p-3 border">
                                    <img
                                        src={`/storage/${product.images[0]}`}
                                        alt={product.imageAlt}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="p-3 border">{getCategoryName(product.category_id)}</td>
                                <td className="p-3 border">{getSubcategoryName(product.subcategory_id)}</td>
                                <td className="p-3 border">{product.name}</td>
                                {/* <td className="p-3 border">
                                    {product.discount ? `${parseFloat(product.discount).toFixed(2)}% OFF` : '0%'}
                                </td> */}
                                <td className="p-3 border">
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={product.status === 'active'}
                                            onChange={() => handleToggleStatus(product)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300"></div>
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
                                        <span className="ml-3 text-sm text-gray-700">
                                            {product.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </label>


                                </td>
                                <td className="p-3 border space-x-2">
                                    <button
                                        onClick={() => setEditProduct(product)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                {/* Pagination Links */}
                {products.data.length > 0 && products.links.length + 2 > 5 && (
                    <div className="mt-6">
                        {products.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => router.visit(link.url)}
                                className={`px-3 py-1 rounded mx-1 ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

            </div>
            {editProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-full max-w-lg relative">
                        <button
                            onClick={() => setEditProduct(null)}
                            className="absolute top-2 right-3 text-xl text-red-500"
                        >
                            &times;
                        </button>

                        {/* Existing UpdateProductForm ka component yaha call karo */}
                        <EditProduct
                            product={editProduct}
                            categories={categories}
                            subcategories={subcategories}
                            onClose={() => setEditProduct(null)}
                        />

                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-full max-w-4xl relative">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="absolute top-2 right-3 text-xl text-red-500"
                        >
                            &times;
                        </button>

                        {/* ✅ Pass onClose function as prop */}
                        <AddProductForm onClose={() => setShowAddForm(false)} categories={props.categories} />
                    </div>
                </div>
            )}


        </>
    );
}
