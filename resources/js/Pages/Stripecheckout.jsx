import React from 'react';
import StripeFormWrapper from '@/Components/StripeForm';

export default function OrderPage({ order }) {
    return (
        <div className="container mx-auto">
            <h1 className="text-xl font-bold mb-4">Checkout</h1>
            <StripeFormWrapper order={order} />
        </div>
    );
}
