import React, { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PurchaseAlert() {
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  // Fetch initial alert on mount
  useEffect(() => {
    router.get('/purchase-alert', {}, {
      preserveState: true,
      onSuccess: ({ props }) => {
        if (props.alert) {
          setAlerts([props.alert]);
          setIsVisible(true);
        }
      },
    });

    // Listen for real-time alerts
    if (window.Echo) {
      const channel = window.Echo.channel('public.purchase-alerts');
      channel.listen('.App\\Events\\PurchaseAlert', (e) => {
        setAlerts((prev) => [...prev.slice(-2), e]); // Keep last 3 alerts
        setIsVisible(true);
      });

      return () => window.Echo.leave('public.purchase-alerts');
    }
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (alerts.length > 0 && isVisible) {
      const timer = setTimeout(() => {
        setAlerts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts, isVisible]);

  const handleClose = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-gradient-to-r from-emerald-100 to-teal-50 p-2 rounded-lg shadow-md mb-2 max-w-xs border border-teal-200 flex items-center space-x-2"
            role="alert"
            aria-live="polite"
            tabIndex={0}
          >
            {/* Product Image */}
            <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              {alert.product_image ? (
                <img
                  src={alert.product_image}
                  alt={alert.message.split('bought ')[1]}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
              )}
            </div>
            {/* Text and Link */}
            <div className="flex-1 text-teal-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium truncate">{alert.message}</p>
                <button
                  onClick={() => handleClose(alert.id)}
                  className="text-teal-500 hover:text-teal-700 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Close purchase alert"
                >
                  &times;
                </button>
              </div>
              <Link
                href={`/products/${alert.product_id}`}
                className="text-teal-600 text-xs font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label={`View ${alert.message.split('bought ')[1]}`}
              >
                View Product
              </Link>
              {/* Progress Bar */}
              <div className="mt-1 h-0.5 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-teal-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}