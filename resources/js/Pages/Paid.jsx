import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key_here');

const PaymentForm = ({ order }) => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        order_id: order?.id,
    });
    const [stripe, setStripe] = useState(null);
    const [cardElement, setCardElement] = useState(null);
    const [cardErrors, setCardErrors] = useState(null);

    useEffect(() => {
        stripePromise.then((stripe) => {
            setStripe(stripe);
            const elements = stripe.elements();
            const card = elements.create('card');
            card.mount('#card-element');
            setCardElement(card);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !cardElement) return;

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: { email: data.email },
        });

        if (error) {
            setCardErrors(error.message);
            return;
        }

        const response = await post('/stripe/checkout', {
            _method: 'POST',
            ...data,
        });

        const { clientSecret } = response.props.clientSecret;

        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

        if (confirmError) {
            setCardErrors(confirmError.message);
        } else {
            window.location.href = `/stripe/success/${order.id}`;
        }
    };

    return (
        <div>
            <h2>Pay ₹{order.total_amount.toFixed(2)}</h2>
            <p>Items: ₹{(order.total_amount - order.shipping_fee).toFixed(2)}</p>
            <p>Shipping Fee: ₹{order.shipping_fee.toFixed(2)}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </div>
                <div>
                    <label>Card Details</label>
                    <div id="card-element" />
                    {cardErrors && <div style={{ color: 'red' }}>{cardErrors}</div>}
                </div>
                <button type="submit" disabled={processing}>Pay</button>
            </form>
        </div>
    );
};

export default PaymentForm;