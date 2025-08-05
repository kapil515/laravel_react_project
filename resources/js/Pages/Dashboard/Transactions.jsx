import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function Transactions() {
    const { transactions } = usePage().props;
    const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);

    const toggleSelectTransaction = (transactionId) => {
        setSelectedTransactionIds((prev) =>
            prev.includes(transactionId)
                ? prev.filter((id) => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    const handleDeleteTransaction = (transactionId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            router.delete(route('transactions.singledelete', transactionId));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedTransactionIds.length === 0) {
            alert('Please select at least one transaction to delete.');
            return;
        }

        if (window.confirm('Are you sure you want to delete the selected transactions?')) {
            router.post(route('transactions.multipleDelete'), {
                transaction_ids: selectedTransactionIds,
            });
        }
    };

    const handleRetryPayment = (orderId) => {
        router.get(route('payment.razorpay', orderId));
    };

    return (
        <div className="p-6">
            {transactions.data.length === 0 ? (
                <p className="text-center text-red-600 mt-5 text-2xl">
                    No transactions have been recorded yet.
                </p>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-red-600">Transaction List</h2>
                        <button
                            onClick={handleDeleteSelected}
                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 text-sm"
                        >
                            Delete Selected Transactions
                        </button>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-full bg-white border text-sm">
                            <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="px-4 py-2 border"></th>
                                    <th className="px-4 py-2 border">Order ID</th>
                                    <th className="px-4 py-2 border">Username</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Role</th>
                                    <th className="px-4 py-2 border">Phone</th>
                                    <th className="px-4 py-2 border">Transaction ID</th>
                                    <th className="px-4 py-2 border">Mode</th>
                                    <th className="px-4 py-2 border">Total Price</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="px-4 py-2 border">
                                            <input
                                                type="checkbox"
                                                checked={selectedTransactionIds.includes(order.id)}
                                                onChange={() => toggleSelectTransaction(order.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 border">{order.order_number || order.id}</td>
                                        <td className="px-4 py-2 border">{order.user?.name || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{order.user?.email || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{order.user?.role || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{order.user?.phone || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{order.payment?.transaction_id || 'N/A'}</td>
                                        <td className="px-4 py-2 border">{order.payment_method || 'N/A'}</td>
                                        <td className="px-4 py-2 border">₹{Number(order.total_amount || 0).toFixed(2)}</td>
                                        <td className="px-4 py-2 border">
                                            <span className={`px-2 py-1 text-xs rounded 
                                                ${order.payment?.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                  order.payment?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                  order.payment?.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                  'bg-gray-100 text-gray-700'}`}>
                                                {order.payment?.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border space-x-2">
                                            <button
                                                onClick={() => handleDeleteTransaction(order.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
                                        ${!link.url ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
