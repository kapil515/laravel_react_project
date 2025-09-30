import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const StripeCardSection = ({ orderId, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleStripePayment = async () => {
        setError(null);
        setLoading(true);

        if (!stripe || !elements) {
            setError("Stripe has not loaded.");
            setLoading(false);
            return false;
        }

        const card = elements.getElement(CardElement);
        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return false;
        }

        const response = await fetch(`/api/orders/${orderId}/pay`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                payment_method_id: paymentMethod.id,
            }),
        });

        const result = await response.json();

        if (result.success) {
            onPaymentSuccess(); // Tell parent to proceed with order placement
            return true;
        } else {
            setError(result.error || "Payment failed.");
            setLoading(false);
            return false;
        }
    };

    return (
        <div className="space-y-4">
            <CardElement className="p-2 border rounded" />
            {error && <div className="text-red-500">{error}</div>}
            {loading && <div className="text-gray-500">Processing...</div>}
        </div>
    );
};

export default StripeCardSection;
