import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function PaymentPage({ order }) {
    const [method, setMethod] = useState('credit_card');

    const {
        data, setData, post, processing, errors, clearErrors,
    } = useForm({
        card_number: '',
        expiry: '',
        cvv: '',
        cardholder_name: '',
        gpay_email: '',
        online_reference: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('payment.credit.process', order.id));
    };

    return (
        <UserLayout>
            <div className="max-w-xl mx-auto py-8 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Payment</h2>

                <div className="flex items-center gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="payment_method"
                            value="credit_card"
                            checked={method === 'credit_card'}
                            onChange={() => { setMethod('credit_card'); clearErrors(); }}
                        />
                        Credit card
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="payment_method"
                            value="gpay"
                            checked={method === 'gpay'}
                            onChange={() => { setMethod('gpay'); clearErrors(); }}
                        />
                        Google Pay
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="payment_method"
                            value="online"
                            checked={method === 'online'}
                            onChange={() => { setMethod('online'); clearErrors(); }}
                        />
                        Online Payment
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {method === 'credit_card' && (
                        <>
                            <input
                                type="text"
                                placeholder="Card number"
                                className="w-full border p-2 rounded"
                                value={data.card_number}
                                onChange={e => setData('card_number', e.target.value)}
                            />
                            {errors.card_number && <p className="text-red-500 text-sm">{errors.card_number}</p>}

                            <input
                                type="text"
                                placeholder="Name on card"
                                className="w-full border p-2 rounded"
                                value={data.cardholder_name}
                                onChange={e => setData('cardholder_name', e.target.value)}
                            />
                            {errors.cardholder_name && <p className="text-red-500 text-sm">{errors.cardholder_name}</p>}

                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Expiration date (MM/YY)"
                                    className="w-1/2 border p-2 rounded"
                                    value={data.expiry}
                                    onChange={e => setData('expiry', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="CVC"
                                    className="w-1/2 border p-2 rounded"
                                    value={data.cvv}
                                    onChange={e => setData('cvv', e.target.value)}
                                />
                            </div>
                            {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry}</p>}
                            {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                        </>
                    )}

                    {method === 'gpay' && (
                        <>
                            <input
                                type="email"
                                placeholder="Google Pay Email"
                                className="w-full border p-2 rounded"
                                value={data.gpay_email}
                                onChange={e => setData('gpay_email', e.target.value)}
                            />
                            {errors.gpay_email && <p className="text-red-500 text-sm">{errors.gpay_email}</p>}
                        </>
                    )}

                    {method === 'online' && (
                        <>
                            <input
                                type="text"
                                placeholder="Online Payment Reference ID"
                                className="w-full border p-2 rounded"
                                value={data.online_reference}
                                onChange={e => setData('online_reference', e.target.value)}
                            />
                            {errors.online_reference && <p className="text-red-500 text-sm">{errors.online_reference}</p>}
                        </>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                        >
                            Pay Now
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
