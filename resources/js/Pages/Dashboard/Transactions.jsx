import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Transactions() {
    const { transactions } = usePage().props;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Transaction List</h2>

            <div className="overflow-auto">
                <table className="min-w-full bg-white border text-sm">
                    <thead className="bg-gray-200 text-left">
                        <tr>
                            <th className="px-4 py-2 border">Order ID</th>
                            <th className="px-4 py-2 border">Username</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Role</th>
                            <th className="px-4 py-2 border">Phone</th>
                            <th className="px-4 py-2 border">Payment Method</th>
                            <th className="px-4 py-2 border">Shipping Fee</th>
                            <th className="px-4 py-2 border">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.data.map(order => (
                            <tr key={order.id} className="border-t">
                                <td className="px-4 py-2 border">{order.order_number}</td>
                                <td className="px-4 py-2 border">{order.user.name}</td>
                                <td className="px-4 py-2 border">{order.user.email}</td>
                                <td className="px-4 py-2 border">{order.user.role}</td>
                                <td className="px-4 py-2 border">{order.user.phone || 'N/A'}</td>
                                <td className="px-4 py-2 border">{order.payment?.payment_method || 'N/A'}</td>
                                <td className="px-4 py-2 border">
                                    {order.payment_method === 'cod' ? '₹50' : '₹0'}
                                </td>
                                <td className="px-4 py-2 border">
                                    <span className={`px-2 py-1 text-xs rounded 
                                        ${order.payment?.status === 'completed' ? 'bg-green-100 text-green-700' :
                                          order.payment?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-gray-100 text-gray-700'}`}>
                                        {order.payment?.status || 'N/A'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {transactions.total > transactions.per_page && (
                <div className="mt-4 flex justify-center gap-2">
                    {transactions.links.map((link, index) => (
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
        </div>
    );
}
