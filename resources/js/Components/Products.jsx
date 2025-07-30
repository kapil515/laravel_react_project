import { Link } from '@inertiajs/react';

export default function Products({ products }) {
    const productList = products?.data || [];
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:py-10">
                <h2 className="text-2xl font-bold text-gray-900 pb-5">Products</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {productList.length > 0 ? (
                        productList.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group"
                            >
                                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                                    <img
                                        alt={product.imageAlt || 'Product image'}
                                        src={product.images && product.images.length > 0 ? `/storage/${product.images[0]}` : ''}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                        onError={(e) => console.log('Image load error:', e, product.images)}
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{product.name || 'No name'}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">
                                    {product.price ? `$${product.price}` : 'N/A'}
                                </p>

                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No products found. Check database or logs.</p>
                    )}
                </div>

                {products?.links?.length > 0 && (
                    <div className="mt-6 flex justify-center gap-2 flex-wrap">
                        {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded-md text-sm ${link.active
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
