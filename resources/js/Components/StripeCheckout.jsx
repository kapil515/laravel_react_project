import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { router } from '@inertiajs/react';

const StripeCheckout = ({ orderId, totalAmount, clientSecret, user }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    if (!totalAmount || isNaN(totalAmount)) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
                <p>Invalid order amount. Please try again.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements) {
            setError('Stripe has not been initialized.');
            setProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card element not found.');
            setProcessing(false);
            return;
        }

        try {
            const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: user.name || 'Customer',
                        email: user.email || null,
                    },
                },
            });

            if (paymentError) {
                setError(paymentError.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                router.get(`/checkout/success/${orderId}?payment_intent=${paymentIntent.id}`, {}, {
                    onSuccess: () => setProcessing(false),
                    onError: (errors) => {
                        setError(errors.error || 'Payment verification failed.');
                        setProcessing(false);
                    },
                });
            } else {
                setError('Payment failed: ' + paymentIntent.status);
                setProcessing(false);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setProcessing(false);
        }
    };

    const handleCancel = () => {
        router.get(`/checkout/cancel/${orderId}`, {}, {
            onSuccess: () => console.log('Payment canceled'),
            onError: (errors) => setError(errors.error || 'Failed to cancel payment.'),
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Pay ${Number(totalAmount).toFixed(2)}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': { color: '#aab7c4' },
                                },
                                invalid: { color: '#9e2146' },
                            },
                        }}
                    />
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        disabled={!stripe || processing}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {processing ? 'Processing...' : 'Pay Now'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={processing}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StripeCheckout;