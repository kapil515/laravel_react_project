import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    useStripe,
    useElements,
    CardElement
} from '@stripe/react-stripe-js';

// Load publishable key from VITE
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function StripeFormWrapper({ order }) {
    return (
        <Elements stripe={stripePromise}>
            <StripeForm order={order} />
        </Elements>
    );
}

function StripeForm({ order }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            // Step 1: Ask Laravel to create a PaymentIntent
            const { data } = await axios.post('/stripe/create-intent', {
                order_id: order.id,
            });

            const clientSecret = data.clientSecret;

            // Step 2: Use Stripe to confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else if (result.paymentIntent.status === 'succeeded') {
                // Step 3: Inform Laravel of payment success
                await axios.post('/stripe/confirm-payment', {
                    order_id: order.id,
                });

                setSuccess('Payment successful!');
                window.location.href = '/thank-you'; // Or use Inertia.visit('/thank-you')
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Pay with Card</h2>

            <div className="border p-3 rounded">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#32325d',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#fa755a' },
                        },
                    }}
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <button
                type="submit"
                disabled={!stripe || !elements || processing}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {processing ? 'Processing...' : `Pay ₹${order.total}`}
            </button>
        </form>
    );
}
