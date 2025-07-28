import { useForm } from '@inertiajs/react';

export default function Cart({ cart }) {
    const { post, delete: destroy } = useForm();

    const handleUpdate = (productId, quantity) => {
        post(route('cart.update'), { product_id: productId, quantity });
    };

    const handleRemove = (productId) => {
        destroy(route('cart.remove'), { data: { product_id: productId } });
    };

    const cartItems = Object.values(cart);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-4">
                                <img src={`/storage/${item.image}`} className="w-16 h-16 object-cover" />
                                <div>
                                    <p>{item.name}</p>
                                    <p>${item.price} × {item.quantity} = <strong>${item.price * item.quantity}</strong></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdate(item.id, Number(e.target.value))}
                                    className="w-16 border rounded px-2 py-1"
                                />
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
