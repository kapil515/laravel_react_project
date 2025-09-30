import React, { useState } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

const OrderStatusUpdate = ({ order }) => {
    const [status, setStatus] = useState(order.status);

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.post(`/orders/${order.id}/status`, { status: newStatus });
            Inertia.reload({ preserveState: true });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
    ];

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium">Update Order Status</h3>
            <select
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value);
                    handleStatusChange(e.target.value);
                }}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="mt-4">
                <h4 className="text-md font-medium">Tracking History</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                    {order.tracking_events.map((event) => (
                        <li key={event.id} className="py-2">
                            <p className="text-sm">
                                <span className="font-medium">{event.status.toUpperCase()}</span>
                                {' - '}
                                {event.note}
                                {' ('}
                                {new Date(event.reported_at).toLocaleString()}
                                {')'}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderStatusUpdate;