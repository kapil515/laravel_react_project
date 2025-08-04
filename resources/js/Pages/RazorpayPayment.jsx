import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function RazorpayPayment({ order, razorpay_order_id, razorpay_key, amount, currency, user }) {
    const { data, setData, post, processing, errors } = useForm({
        razorpay_payment_id: '',
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: '',
    });
    const [scriptError, setScriptError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    const loadRazorpayScript = (callback) => {
        console.log('Loading Razorpay script... Attempt:', retryCount + 1);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            console.log('Razorpay script loaded successfully');
            callback();
        };
        script.onerror = () => {
            console.error('Failed to load Razorpay script');
            setScriptError('Failed to load Razorpay payment system. Please try again.');
            if (retryCount < maxRetries) {
                setRetryCount(retryCount + 1);
            }
        };
        document.body.appendChild(script);
        return script;
    };

    useEffect(() => {
        console.log('RazorpayPayment props:', { order, razorpay_order_id, razorpay_key, amount, currency, user });

        if (!razorpay_key || !razorpay_order_id || !amount) {
            console.error('Missing required props for Razorpay', { razorpay_key, razorpay_order_id, amount });
            setScriptError('Invalid payment configuration. Please try again.');
            return;
        }

        const openRazorpay = () => {
            if (window.Razorpay) {
                const options = {
                    key: razorpay_key,
                    amount: amount,
                    currency: currency,
                    order_id: razorpay_order_id,
                    name: 'Your Company Name',
                    description: `Payment for order #${order.id}`,
                    handler: function (response) {
                        console.log('Razorpay payment response:', response);
                        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                            console.error('Incomplete Razorpay response', response);
                            setScriptError('Payment failed: Incomplete response from Razorpay.');
                            router.visit(route('orders.thankyou', order.id));
                            return;
                        }
                        setData({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        console.log('Submitting callback with data:', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        post(route('payment.razorpay.callback'), {
                            onSuccess: () => {
                                console.log('Payment callback successful');
                                router.visit(route('orders.thankyou', order.id));
                            },
                            onError: (error) => {
                                console.error('Payment callback failed:', error);
                                setScriptError('Payment failed: Server error.');
                                router.visit(route('orders.thankyou', order.id));
                            },
                        });
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone || '',
                    },
                    theme: {
                        color: '#F37254',
                    },
                };

                console.log('Razorpay options:', options);

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    console.error('Razorpay payment failed:', response);
                    setScriptError(`Payment failed: ${response.error.description}`);
                    router.visit(route('orders.thankyou', order.id));
                });
                rzp.open();
                console.log('Razorpay checkout opened');
            } else {
                console.error('Razorpay SDK not available');
                setScriptError('Razorpay payment system not available. Please try again.');
            }
        };

        let script;
        if (retryCount < maxRetries) {
            script = loadRazorpayScript(openRazorpay);
        } else {
            setScriptError('Maximum retry attempts reached. Please try again later.');
        }

        return () => {
            if (script && script.parentNode) {
                console.log('Cleaning up Razorpay script');
                document.body.removeChild(script);
            }
        };
    }, [razorpay_key, amount, currency, razorpay_order_id, order.id, user, retryCount]);

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Processing Razorpay Payment</h1>
                {scriptError ? (
                    <>
                        <p className="text-red-500 mb-4">{scriptError}</p>
                        <button
                            onClick={() => router.get(route('payment.razorpay', order.id))}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            disabled={processing}
                        >
                            Retry Payment
                        </button>
                    </>
                ) : (
                    <p>Please complete the payment in the Razorpay checkout window.</p>
                )}
                {errors.razorpay_payment_id && (
                    <p className="text-red-500 mt-4">{errors.razorpay_payment_id}</p>
                )}
            </div>
        </UserLayout>
    );
}