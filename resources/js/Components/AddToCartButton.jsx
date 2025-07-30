import { router } from '@inertiajs/react';

export default function AddToCartButton({ productId }) {
    function handleAddToCart() {
        console.log('Adding product', productId);

        router.post(route('cart.add'), {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Product added to cart');
            },
            onError: (errors) => {
                console.error('Cart add error:', errors);
            }
        });
    }

    return (
        <button
            onClick={handleAddToCart}
            className="px-4 py-2 text-white bg-blue-600 rounded"
        >
            Add to Cart
        </button>
    );
}
