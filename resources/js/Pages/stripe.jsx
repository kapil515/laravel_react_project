import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

const OrderForm = ({ orderId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });


        if (stripeError) {
            console.error(stripeError);
            setError(stripeError.message);
            return;
        }

        try {
            const response = await fetch(`/orders/${orderId}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },

                body: JSON.stringify({
                    payment_method_id: paymentMethod.id, // ✅ REQUIRED
                }),

            });

            const result = await response.json();

            if (result.success) {
                console.log("Payment successful");
                // e.g., redirect to thank-you page
            } else {
                console.error("Order failed:", result);
                setError(result.error || "Payment failed.");
            }
        } catch (err) {
            console.error('Request error:', err);
            setError('Something went wrong.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
};

export default OrderForm;
