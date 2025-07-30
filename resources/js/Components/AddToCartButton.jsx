import { useForm } from '@inertiajs/react';

export default function AddToCartButton({ productId }) {
    const { post } = useForm();

    const handleAddToCart = () => {
        post(route('cart.add'), {
            product_id: productId,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Navigate to cart after adding
                window.location.href = route('cart.index');
            }
        });
    };

    return (
        <button onClick={handleAddToCart} className="px-4 py-2 text-white bg-green-600 rounded">
            Add to Cart
        </button>
    );
}
