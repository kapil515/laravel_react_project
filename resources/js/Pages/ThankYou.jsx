import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { usePage, router } from '@inertiajs/react';

export default function ThankYou() {
    const { order, flash,transaction_id } = usePage().props;

    console.log('ThankYou props:', { order, flash });

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    {order.status === 'pending' ? 'Order Placed, Awaiting Payment' : 'Thank You for Your Order!'}
                </h1>
                <p className="text-lg mb-6">
                    {order.status === 'pending' ? 'Please complete the payment to confirm your order.' : 'Your order has been placed successfully.'}
                </p>
                {flash?.success && <p className="text-green-600 mb-4">{flash.success}</p>}
                {flash?.error && <p className="text-red-600 mb-4">{flash.error}</p>}

                <div className="text-left bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mt-4">Customer Details:</h3>
                    <p><strong>Name:</strong> {order.user?.name}</p>
                    <p><strong>Email:</strong> {order.user?.email}</p>
                    <p><strong>Phone:</strong> {order.user?.phone || 'N/A'}</p>
                    <p><strong>Role:</strong> {order.user?.role || 'N/A'}</p>
                    <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Order Number:</strong> {order.order_number || 'N/A'}</p>
                    <p><strong>Customer:</strong> {order.user.name}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Payment Method:</strong> {order.payment_method}</p>

                    <h3 className="text-lg font-semibold mt-4">Shipping Details:</h3>
                    <p>{order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}</p>
                    <p>{order.city}, {order.state}, {order.postal_code}</p>
                    <p>{order.country}</p>

                   <h3 className="text-lg font-semibold mt-4">Transaction Details:</h3>
                    {order.payment ? (
                        <p><strong>Transaction ID:</strong> {order.payment.transaction_id}</p>
                    ) : (
                        <p className="text-gray-500">No payment record found.</p>
                    )}
                    <h3 className="text-lg font-semibold mt-4">Items:</h3>
                    <ul className="list-disc ml-5">
                        {order.items.map(item => (
                            <li key={item.id}>
                                {item.product.name} × {item.quantity} — ${item.price}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 font-bold text-right">
                        Total: ${order.total_amount}
                        {order.shipping_fee > 0 && (
                            <p>Shipping Fee: ${order.shipping_fee}</p>
                        )}
                    </div>
                </div>

                {order.status === 'pending' && order.payment_method === 'online' && (
                    <button
                        onClick={() => router.get(route('payment.razorpay', order.id))}
                        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Complete Payment
                    </button>
                )}
            </div>
        </UserLayout>
    );
}