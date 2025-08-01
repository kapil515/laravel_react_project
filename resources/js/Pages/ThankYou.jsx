import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { usePage, router } from '@inertiajs/react';

export default function ThankYou() {
    const { order } = usePage().props;

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You for Your Order!</h1>
                <p className="text-lg mb-6">Your order has been placed successfully.</p>

                <div className="text-left bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Customer:</strong> {order.user.name}</p>
                    <p><strong>Status:</strong> {order.status}</p>

                    <h3 className="text-lg font-medium mt-4">Shipping Details:</h3>
                    <p>{order.address_line1}, {order.address_line2}</p>
                    <p>{order.city}, {order.state}, {order.postal_code}</p>
                    <p>{order.country}</p>

                    <h3 className="text-lg font-medium mt-4">Items:</h3>
                    <ul className="list-disc ml-5">
                        {order.items.map(item => (
                            <li key={item.id}>
                                {item.product.name} × {item.quantity} — ${item.price}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 font-bold text-right">
                        Total: ${order.total_amount}
                    </div>
                </div>

                <button
                    onClick={() => router.get(route('transactions.start', order.id))}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Pay Now
                </button>
            </div>
        </UserLayout>
    );
}
