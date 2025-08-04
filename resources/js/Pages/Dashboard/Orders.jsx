import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Orders({ orders }) {
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);

    const toggleSelectOrder = (orderId) => {
        setSelectedOrderIds((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleDelete = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            router.delete(route('orders.destroy', orderId));
        }
    };

    const handleDeleteSelected = () => {
        if (orders.data.length === 1) {
            const onlyOrderId = orders.data[0].id;
            if (window.confirm('Are you sure you want to delete this order?')) {
                router.delete(route('orders.destroy', onlyOrderId));
            }
            return;
        }

        if (selectedOrderIds.length >= 1) {
            if (window.confirm('Are you sure you want to delete the selected orders?')) {
                router.post(route('orders.massDestroy'), {
                    order_ids: selectedOrderIds,
                });
            }
        } else {
            alert('Please select at least 1 order to delete.');
        }
    };

    return (
        <div className="p-6">
            {orders.data.length === 0 ? (
                <p className="text-center text-red-600 mt-5 text-2xl">No orders have been placed by users yet.</p>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl capitalize text-red-600 font-bold hover:text-red-500">All Orders</h2>
                        <button
                            onClick={handleDeleteSelected}
                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 text-sm"
                        >
                            Delete Selected Orders
                        </button>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-200 text-left text-sm text-green-700">
                                <tr>
                                    <th className="px-4 py-2 border"></th>
                                    <th className="px-4 py-2 border">Order ID</th>
                                    <th className="px-4 py-2 border">User Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Role</th>
                                    <th className="px-4 py-2 border">Phone</th>
                                    <th className="px-4 py-2 border">Total Price</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data.map((order) =>
                                    order.items.map((item, index) => (
                                        <tr key={`${order.id}-${item.id}`} className="text-sm border-t">
                                            {index === 0 && (
                                                <>
                                                    <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedOrderIds.includes(order.id)}
                                                            onChange={() => toggleSelectOrder(order.id)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                        {order.order_number}
                                                    </td>
                                                    <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                        {order.user.name}
                                                    </td>
                                                    <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                        {order.user.email}
                                                    </td>
                                                    <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                        {order.user.role}
                                                    </td>
                                                    <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                        {order.user.phone || 'N/A'}
                                                    </td>
                                                </>
                                            )}
                                            {index === 0 && (
                                                <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                     ₹{order.items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}
                                                </td>
                                            )}
                                            {index === 0 && (
                                            <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded 
                                                        ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        )}

                                            {index === 0 && (
                                                <td className="px-4 py-2 border" rowSpan={order.items.length}>
                                                    <button
                                                        onClick={() => router.get(route('orders.adminshow', order.id))}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm mr-2"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order.id)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.total > orders.per_page && (
                        <div className="mt-6 flex justify-center space-x-2 text-sm">
                            {orders.links.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 border rounded 
                                        ${link.active ? 'bg-red-600 text-white' : 'bg-white text-black'} 
                                        ${!link.url && 'text-gray-400 cursor-not-allowed'}`}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
