import React from 'react';
import { Link } from '@inertiajs/react';

export default function OrderDetails({ order }) {
    return (
        <div className="p-8 max-w-5xl mx-auto mb-20 bg-white rounded-lg shadow-md space-y-8">
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">👤 User Info</h2>
                <div className="space-y-1 text-gray-700">
                    <p><strong>Name:</strong> {order.user.name}</p>
                    <p><strong>Email:</strong> {order.user.email}</p>
                    <p><strong>Role:</strong> {order.user.role}</p>
                </div>
            </div>

            {/* Section: Products */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🛒 Products in Cart</h2>
                <div className="grid gap-4">
                    {order.items.map(item => (
                        <div
                            key={item.id}
                            className="flex items-start gap-4 border p-4 rounded shadow-sm"
                        >
                            <img
                                src={item.product.images?.[0] || '/placeholder.png'}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="space-y-1 text-gray-700">
                                <p><strong>Name:</strong> {item.product.name}</p>
                                  <p><strong>Category:</strong> {item.product.category?.name || 'N/A'}</p>
                                <p><strong>Subcategory:</strong> {item.product.subcategory?.name || 'N/A'}</p>
                                <p><strong>Price:</strong> ${item.price}</p>
                                <p><strong>Description:</strong> {item.product.description}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Subtotal:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section: Order Info */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">📦 Order Info</h2>
                <div className="space-y-1 text-gray-700">
                    <p><strong>Total Amount:</strong> ${order.total_amount}</p>
                    <p><strong>Payment Method:</strong> {order.payment_method}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                </div>
            </div>

            {/* Section: Shipping Info */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">🚚 Shipping Address</h2>
                <div className="space-y-1 text-gray-700">
                    <p><strong>Address Line 1:</strong> {order.address.address_line1}</p>
                    <p><strong>Address Line 2:</strong> {order.address.address_line2}</p>
                    <p><strong>City:</strong> {order.address.city}</p>
                    <p><strong>State:</strong> {order.address.state}</p>
                    <p><strong>Postal Code:</strong> {order.address.postal_code}</p>
                    <p><strong>Country:</strong> {order.address.country}</p>
                </div>
            </div>

                        <div className="text-center mb-6">
                        <Link
                        href={route('dashboard.orders')}
                        className="bg-yellow-600 text-white px-4 py-2 py-1 rounded hover:bg-yellow-500 text-sm inline-block"
                        >
                        Back to Orders
                        </Link>
                        </div>
        </div>
    );
}
