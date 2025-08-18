import React from 'react';
import { usePage } from '@inertiajs/react';
import OrderTrackingTimeline from '@/Components/OrderTrackingTimeline';



export default function OrderTrackingPage() {
  const { order} = usePage().props;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Order Tracking for {order.order_number || order.id}
        </h2>
        <OrderTrackingTimeline
          orderId={order.id}
          initialEvents={order.tracking_events || []}
        />
        <div className="mt-6 text-center">
        <a
            href={`/orders/${order.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Orders details
          </a>
        </div>
      </div>
    </div>
  );
}