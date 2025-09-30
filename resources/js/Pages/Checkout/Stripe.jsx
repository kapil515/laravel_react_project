import React from 'react';
import StripeCheckout from '@/Components/StripeCheckout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckoutPage = ({ orderId, totalAmount, clientSecret, user }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Elements stripe={stripePromise}>
                <StripeCheckout
                    orderId={orderId}
                    totalAmount={totalAmount}
                    clientSecret={clientSecret}
                    user={user}
                />
            </Elements>
        </div>
    );
};

export default StripeCheckoutPage;