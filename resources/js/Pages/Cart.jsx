import React from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function Cart() {
    // Get cartItems from server-side props. Default to empty array if undefined.
    const { cartItems = [] } = usePage().props;

    // Calculate total price
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-gray-600">
                    Your cart is empty.
                    <Link
                        href="/products"
                        className="ml-2 text-blue-600 underline"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {cartItems.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border-b pb-4"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-gray-600">
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>
                            <div className="text-lg font-bold">
                                ₹{item.price * item.quantity}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center mt-6 pt-6 border-t">
                        <h2 className="text-xl font-bold">Total</h2>
                        <div className="text-xl font-bold">₹{total}</div>
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        onClick={() => alert('Checkout coming soon!')}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
