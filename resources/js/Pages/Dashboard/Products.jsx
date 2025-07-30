import AddProductForm from '@/Components/AddProductForm';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import EditProduct from './EditProductForm';
import CreateCategoryWithSubcategory from '@/Components/CreateCategoryWithSubcategory';
import { usePage } from '@inertiajs/react';

export default function Products({ products}) {
    const [editProduct, setEditProduct] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
     const { props } = usePage();


    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('products.destroy', id));
        }
    };

    return (
        <>
            <div className="p-6 space-y-4">
                <div className='flex justify-between items-center relative'>
                    <h1 className="text-2xl font-bold mb-4">All Products</h1>
                    <div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mr-4"
                        >
                            Add New Product
                        </button>
                        <button
                            onClick={() => setShowCategoryForm(true)}
                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Add New Category
                        </button>
                    </div>
                </div>

                <ul className="space-y-4">
                    {products.data.map((product) => (
                        <li
                            key={product.id}
                            className="bg-white rounded-lg shadow flex items-center justify-between p-4"
                        >
                            <div className="flex items-center">
                                <img
                                    src={`/storage/${product.images[0]}`}
                                    alt={product.imageAlt}
                                    className="w-20 h-20 object-cover rounded mr-4"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-green-600">{product.price}</p>
                                </div>
                            </div>

                            <div className="flex">
                                <button onClick={() => setEditProduct(product)}
                                    className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
                                    Update
                                </button>

                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Pagination Links */}
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
                        <EditProduct product={editProduct} onClose={() => setEditProduct(null)} />
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-full max-w-lg relative">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="absolute top-2 right-3 text-xl text-red-500"
                        >
                            &times;
                        </button>

                        {/* ✅ Pass onClose function as prop */}
                        <AddProductForm onClose={() => setShowAddForm(false)} categories={props.categories}/>
                    </div>
                </div>
            )}

            {showCategoryForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-full max-w-lg relative">
                        <button
                            onClick={() => setShowCategoryForm(false)}
                            className="absolute top-2 right-3 text-xl text-red-500"
                        >
                            &times;
                        </button>
                        <CreateCategoryWithSubcategory onClose={() => setShowCategoryForm(false)} />
                    </div>
                </div>
            )}


        </>
    );
}
