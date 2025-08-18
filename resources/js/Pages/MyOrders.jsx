
import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import OrderTrackingTimeline from '@/Components/OrderTrackingTimeline';
import UserLayout from '@/Layouts/UserLayout';

export default function MyOrders() {
    const { transactions: initialTransactions } = usePage().props;
    const [transactions, setTransactions] = useState(initialTransactions);
    const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);
    const currentPage = transactions.current_page;
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);

     const STATUS_ORDER = ['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

    const getValidStatuses = (currentStatus, paymentMethod) => {
        const currentIndex = STATUS_ORDER.indexOf(currentStatus || 'pending');
        let validStatuses = STATUS_ORDER.slice(currentIndex + 1);

       if (currentStatus === 'delivered' || currentStatus === 'canceled') {
            validStatuses = [];
        }

        return validStatuses;
    };

    const toggleSelectTransaction = (transactionId) => {
        setSelectedTransactionIds((prev) =>
            prev.includes(transactionId)
                ? prev.filter((id) => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    const handleDeleteTransaction = (transactionId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            router.delete(route('transactions.singledelete', transactionId), {
                data: { page: currentPage },
                preserveScroll: true,
                onSuccess: () => {
                    setTransactions((prev) => ({
                        ...prev,
                        data: prev.data.filter((t) => t.id !== transactionId)
                    }));
                }
            });
        }
    };

    const updateOrderStatus = (orderId, newStatus) => {
        router.patch(route('orders.updateStatus', orderId), {
            status: newStatus,
            page: currentPage,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                setTransactions(page.props.transactions);
                if (trackingOrder && trackingOrder.id === orderId) {
                    setTrackingOrder((prev) => ({
                        ...prev,
                        status: newStatus,
                        tracking_events: [
                            ...(prev.tracking_events || []),
                            {
                                status: newStatus,
                                reported_at: new Date().toISOString(),
                            },
                        ].sort((a, b) => new Date(a.reported_at) - new Date(b.reported_at)),
                    }));
                }
            },
            onError: (errors) => {
                console.error('Failed to update status', errors);
                alert(errors.status || 'Failed to update status. Please try again.');
                setTransactions((prev) => ({
                    ...prev,
                    data: prev.data.map((order) =>
                        order.id === orderId ? { ...order, status: order.status || 'pending' } : order
                    ),
                }));
                if (trackingOrder && trackingOrder.id === orderId) {
                    setTrackingOrder((prev) => ({
                        ...prev,
                        status: prev.status || 'pending',
                    }));
                }
            },
        });
    };

    const handleCancelOrder = (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            router.post(route('orders.cancel', orderId), {
                page: currentPage,
            }, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setTransactions(page.props.transactions);
                    if (trackingOrder && trackingOrder.id === orderId) {
                        setTrackingOrder((prev) => ({
                            ...prev,
                            status: 'canceled',
                            tracking_events: [
                                ...(prev.tracking_events || []),
                                {
                                    status: 'canceled',
                                    reported_at: new Date().toISOString(),
                                    note: 'Order canceled by user.',
                                },
                            ].sort((a, b) => new Date(a.reported_at) - new Date(b.reported_at)),
                        }));
                    }
                },
                onError: (errors) => {
                    console.error('Failed to cancel order', errors);
                    alert(errors.status || 'Failed to cancel order. Please try again.');
                },
            });
        }
    };

    const handleViewOrder = (orderId) => {
        router.visit(route('orders.usershow', orderId));
    };

    return (
        <UserLayout>
        <div className="p-6 m-12">
            {transactions.data.length === 0 ? (
                <p className="text-center text-red-600 mt-5 text-2xl">
                    No transactions have been recorded yet.
                </p>
            ) : (
                <>
                    <div className="flex items-center justify-between m-auto mb-4">
                        <h2 className="text-2xl font-bold text-red-600">My Orders</h2>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full bg-white border text-sm">
                            <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="px-4 py-2 border"></th>
                                    <th className="px-4 py-2 border">Order ID</th>
                                     <th className="px-4 py-2 border">Name</th>
                                        <th className="px-4 py-2 border">Email</th>
                                        <th className="px-4 py-2 border">Phone</th>
                                        <th className="px-4 py-2 border">Transaction ID</th>
                                    <th className="px-4 py-2 border">Total Price</th>
                                    <th className="px-4 py-2 border">Payment Method</th>
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
                                            <td className="px-4 py-2 border">{order.user?.phone || 'N/A'}</td>
                                            <td className="px-4 py-2 border">{order.payment?.transaction_id || 'N/A'}</td>
                                        <td className="px-4 py-2 border">${Number(order.total_amount || 0).toFixed(2)}</td>
                                        <td className="px-4 py-2 border">{order.payment_method || 'N/A'}</td>
                                        <td className="px-4 py-2 border text-center">
                                            {(order.status === 'delivered' || order.status === 'canceled') ? (
                                                <span
                                                    style={{
                                                        backgroundColor: order.status === 'delivered' ? '#0c6456ff' : '#ef4444',
                                                        color: 'white',
                                                        padding: '0.5rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        display: 'inline-block',
                                                        minWidth: '200px'
                                                    }}
                                                >
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            ) : (
                                                <select
                                                    value={order.status || 'pending'}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className="rounded text-sm text-center"
                                                    style={{
                                                        backgroundColor: '#d4cdcdff',
                                                        color: 'black',
                                                        minWidth: '200px',
                                                    }}
                                                >
                                                    <option value={order.status || 'pending'} disabled>
                                                        {order.status?.replace(/_/g, ' ') || 'pending'}
                                                    </option>
                                                    {getValidStatuses(order.status).map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.replace(/_/g, ' ')}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border space-x-2">
                                            {order.status !== 'canceled' && (
                                                <button
                                                    onClick={() => {
                                                        setTrackingOrder(order);
                                                        setShowTrackingModal(true);
                                                    }}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                                >
                                                    Track
                                                </button>
                                            )}
                                            {(order.status === 'packed' || order.status === 'shipped') && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                             <button
                                                    onClick={() => handleViewOrder(order.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                                >
                                                    View
                                                </button>
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
            {showTrackingModal && trackingOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            Tracking for Order {trackingOrder.order_number || trackingOrder.id}
                        </h2>
                        <OrderTrackingTimeline
                            orderId={trackingOrder.id}
                            initialEvents={trackingOrder.tracking_events || []}
                        />
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setShowTrackingModal(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </UserLayout>
    );
}
