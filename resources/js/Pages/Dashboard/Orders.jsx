import React from 'react';
import {  router } from '@inertiajs/react';

export default function Orders({ orders }) {

    function handleDelete(orderId) {
    if (window.confirm('Are you sure you want to delete this order?')) {
        router.delete(route('orders.destroy', orderId));
    }
}

    return (
        <div className="p-6">
            <h2 className="text-2xl text-center capitalize text-red-600 font-bold mb-4 hover:text-red-500">All Orders</h2>
            <div className="overflow-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-200">
                        <tr className="text-left text-sm text-green-700">
                            <th className="px-4 py-2 border hover:text-green-500">Order ID</th>
                            <th className="px-4 py-2 border hover:text-green-500">User Name</th>
                            <th className="px-4 py-2 border hover:text-green-500">Email</th>
                            <th className="px-4 py-2 border hover:text-green-500">Role</th>
                            <th className="px-4 py-2 border hover:text-green-500">Product</th>
                            <th className="px-4 py-2 border hover:text-green-500">Image</th>
                            <th className="px-4 py-2 border hover:text-green-500">Product ID</th>
                            <th className="px-4 py-2 border hover:text-green-500">Quantity</th>
                            <th className="px-4 py-2 border hover:text-green-500">Price</th>
                            <th className="px-4 py-2 border hover:text-green-500">Total Price</th>
                            <th className="px-4 py-2 border hover:text-green-500">Status</th>
                            <th className="px-4 py-2 border hover:text-green-500">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order =>
                            order.items.map((item, index) => (
                                <tr key={`${order.id}-${item.id}`} className="text-sm border-t">
                                    {index === 0 && (
                                        <>
                                            <td className="px-4 py-2 border" rowSpan={order.items.length}>{order.id}</td>
                                            <td className="px-4 py-2 border" rowSpan={order.items.length}>{order.user.name}</td>
                                            <td className="px-4 py-2 border" rowSpan={order.items.length}>{order.user.email}</td>
                                            <td className="px-4 py-2 border" rowSpan={order.items.length}>{order.user.role}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-2 border">{item.product?.name}</td>
                                    <td className="px-4 py-2 border">
                                      <img
                                        src={
                                            item.product?.images?.[0]
                                            ? item.product.images[0]
                                            : '/placeholder.jpg'
                                        }
                                        alt={item.product?.name}
                                        className="w-12 h-12 object-cover rounded-full"
                                        />


                                    </td>
                                    <td className="px-4 py-2 border">{item.product?.id}</td>
                                    <td className="px-4 py-2 border">{item.quantity}</td>
                                    <td className="px-4 py-2 border">${item.price}</td>
                                    <td className="px-4 py-2 border">${(item.quantity * item.price).toFixed(2)}</td>
                                    <td className="px-4 py-2 border">{order.status}</td>
                                    {index === 0 && (
                              <td className="px-4 py-2 border" rowSpan={order.items.length}>
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
        </div>
    );
}
