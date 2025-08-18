import React, { useEffect, useMemo, useState } from 'react';

const LABELS = {
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
   canceled: 'Canceled',
};

const STATUS_MESSAGES = {
  packed: "Your order has been packed and will be shipped soon.",
  shipped: "Your order has been shipped.",
  out_for_delivery: "Your order is out for delivery and will reach you before 10 PM.",
  delivered: "Your order has been delivered. Enjoy!",
    canceled: 'Your order has been canceled.',
};

const ORDER = ['packed', 'shipped', 'out_for_delivery', 'delivered'];

export default function OrderTrackingTimeline({ orderId, initialEvents = [] }) {
  const [events, setEvents] = useState(
    [...initialEvents]
      .filter(e => ORDER.includes(e.status))
      .sort((a, b) => new Date(a.reported_at) - new Date(b.reported_at))
  );

  const latestByStatus = useMemo(() => {
    const map = {};
    for (const ev of events) map[ev.status] = ev;
    return map;
  }, [events]);

  const currentIndex = useMemo(() => {
    for (let i = ORDER.length - 1; i >= 0; i--) {
      if (latestByStatus[ORDER[i]]) return i;
    }
    return -1;
  }, [latestByStatus]);

  useEffect(() => {
    if (!window.Echo) return;

    const channel = window.Echo.private(`order.${orderId}`);

    channel.listen('.OrderTrackingUpdated', (e) => {
      if (!e.admin_user_id && window.Laravel.user.id !== e.order_id) return;

      setEvents(prev => {
        const currentIdx = currentIndex;
        const newIdx = ORDER.indexOf(e.status);

       // Allow 'canceled' or forward progress
                if (e.status !== 'canceled' && newIdx <= currentIdx) return prev;

                return [...prev, e].sort((a, b) => new Date(a.reported_at) - new Date(b.reported_at));
            });

            // Show browser notification for logged-out users
            if (!window.Laravel.user) {
                if (Notification.permission === 'granted') {
                    new Notification(`Order Update for #${e.order_number || orderId}`, {
                        body: `${LABELS[e.status] || e.status}${e.location_text ? ` @ ${e.location_text}` : ''}${e.note ? `: ${e.note}` : ''}`,
                        icon: '/favicon.ico', // Replace with your app's icon path
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification(`Order Update for #${e.order_number || orderId}`, {
                                body: `${LABELS[e.status] || e.status}${e.location_text ? ` @ ${e.location_text}` : ''}${e.note ? `: ${e.note}` : ''}`,
                                icon: '/favicon.ico',
                            });
                        }
                    }).catch(error => {
                        console.error('Notification permission request failed:', error);
                    });
                }
            } else {
                // Toast notification for logged-in users
                const label = LABELS[e.status] || e.status;
                const toast = document.createElement('div');
                toast.textContent = `Order update: ${label}${e.location_text ? ` @ ${e.location_text}` : ''}${e.note ? `: ${e.note}` : ''}`;
                toast.className = 'fixed top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-xl shadow z-50';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        });

        return () => {
            window.Echo.leave(`order.${orderId}`);
        };
    }, [orderId, currentIndex]);

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-xl font-semibold mb-4">Order Tracking</h3>
      <ol className="relative border-s-2 border-gray-200 ps-4">
        {ORDER.map((step, idx) => {
          const done = idx <= currentIndex;
          const ev = latestByStatus[step];

          return (
            <li key={step} className="mb-8 ms-2">
              <span className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white ${done ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold">{LABELS[step]}</h4>
                  {idx <= currentIndex && (
                    <p className="text-sm text-gray-600">
                      {idx === currentIndex && ev ? (
                        <>
                          {ev.note || STATUS_MESSAGES[step]}
                          {ev.reported_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(ev.reported_at).toLocaleString()}
                            </p>
                          )}
                          {(step === 'out_for_delivery' || step === 'delivered') && (ev.deliveryman_name || ev.deliveryman_phone) && (
                            <div className="mt-2 text-sm">
                              <div className="font-medium">Delivery Partner</div>
                              <div className="text-gray-700">
                                {ev.deliveryman_name || '—'}
                                {ev.deliveryman_phone ? ` · ${ev.deliveryman_phone}` : ''}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        STATUS_MESSAGES[step]
                      )}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs rounded-xl self-start ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {done ? 'Done' : 'Pending'}
                </span>
              </div>
            </li>
          );
        })}
         {latestByStatus.canceled && (
                    <li key="canceled" className="mb-8 ms-2">
                        <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white bg-red-500" />
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-base font-semibold">{LABELS.canceled}</h4>
                                <p className="text-sm text-gray-600">
                                    {latestByStatus.canceled.note || STATUS_MESSAGES.canceled}
                                    {latestByStatus.canceled.reported_at && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(latestByStatus.canceled.reported_at).toLocaleString()}
                                        </p>
                                    )}
                                </p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-xl self-start bg-red-100 text-red-700">Canceled</span>
                        </div>
                    </li>
                )}
      </ol>
    </div>
  );
}