import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { stripePromise } from '../Pages/stripe';
import UserLayout from '@/Layouts/UserLayout';

function StripeFormComponent() {
    const { cartItems } = usePage().props;
    const stripe = useStripe();
    const elements = useElements();

    const { data, setData, post, processing, errors } = useForm({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        payment_method: '',
        payment_method_id: '',
        cart: cartItems?.map(item => ({
            id: item.id,
            quantity: item.quantity,
        })) || [],
    });

    useEffect(() => {
        setData('cart', cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
        })));
    }, [cartItems]);
    const calculateTotalAmount = (items) => {
        return Math.round(
            items.reduce((total, item) => total + item.price * item.quantity, 0) * 100
        );
    };

    const [cardError, setCardError] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const isStripeReady = stripe && elements;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCardError('');

        if (data.payment_method === 'stripe') {
            if (!isStripeReady) {
                setCardError('Stripe is not loaded yet. Please wait and try again.');
                return;
            }

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                setCardError('Card element not found. Please refresh the page.');
                return;
            }

            setIsProcessingPayment(true);

            try {
                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                });

                if (error) {
                    console.error('Stripe error:', error);
                    setCardError(error.message);
                    setIsProcessingPayment(false);
                    return;
                }

                setData('payment_method_id', paymentMethod.id);

                setTimeout(() => {
                    post(route('orders.store'), {
                        data: {
                            ...data,
                            payment_method_id: paymentMethod.id,
                            cart: cartItems.map(item => ({
                                id: item.id,
                                quantity: item.quantity,
                            })),
                        },
                        preserveScroll: true,
                        onSuccess: (page) => {
                            console.log('✅ Order successful');
                            const redirectTo = page.props?.redirect_to;
                            if (redirectTo) {
                                window.location.assign(redirectTo);
                            }
                        },
                        onError: (err) => {
                            console.error('❌ Submission error:', err);
                            setCardError('Order failed. Please check payment info.');
                        },
                        onFinish: () => {
                            setIsProcessingPayment(false);
                        },
                    });
                }, 0);

            } catch (error) {
                console.error('❌ Stripe PaymentMethod creation error:', error);
                setCardError('Unexpected error: ' + error.message);
                setIsProcessingPayment(false);
            }

        } else {
            const payload = {
                ...data,
                cart: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
            };

            post(route('orders.store'), {
                data: payload,
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log('✅ Non-stripe order placed');
                    const redirectTo = page.props?.redirect_to;
                    if (redirectTo) {
                        window.location.assign(redirectTo);
                    }
                },
                onError: (err) => {
                    console.error('❌ Order failed:', err);
                },
            });
        }
    };






    return (
        <UserLayout>
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Address Fields */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                        type="text"
                        value={data.address_line1}
                        onChange={e => setData('address_line1', e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.address_line1 && <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                        type="text"
                        value={data.address_line2}
                        onChange={e => setData('address_line2', e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                            type="text"
                            value={data.city}
                            onChange={e => setData('city', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            required
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                            type="text"
                            value={data.state}
                            onChange={e => setData('state', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            required
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                        <input
                            type="text"
                            value={data.postal_code}
                            onChange={e => setData('postal_code', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            required
                        />
                        {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                        <input
                            type="text"
                            value={data.country}
                            onChange={e => setData('country', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                            required
                        />
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                    <select
                        value={data.payment_method}
                        onChange={e => {
                            setData('payment_method', e.target.value);
                            setCardError('');
                        }}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        required
                    >
                        <option value="">Select Payment Method</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="online">Razorpay</option>
                        <option value="stripe">Stripe Payment</option>
                        <option value="paypal">PayPal</option>
                    </select>
                    {errors.payment_method && <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>}
                </div>

                {/* Stripe Card Input */}
                {
                    data.payment_method === 'stripe' && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                            {!isStripeReady ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <span className="ml-2 text-sm text-gray-500">Loading Stripe...</span>
                                </div>
                            ) : (
                                <div className="border border-gray-300 p-3 rounded bg-white">
                                    <CardElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: '16px',
                                                    color: '#424770',
                                                    '::placeholder': {
                                                        color: '#aab7c4',
                                                    },
                                                },
                                                invalid: {
                                                    color: '#9e2146',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            )}
                            {cardError && <p className="text-red-500 text-sm mt-2">{cardError}</p>}

                            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                                <strong>Test Card:</strong> 4242 4242 4242 4242 | Any future date | Any 3 digits
                            </div>
                        </div>
                    )
                }

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing || isProcessingPayment || (data.payment_method === 'stripe' && !isStripeReady)}
                    className={`w-full py-3 px-4 rounded font-medium transition-colors ${processing || isProcessingPayment || (data.payment_method === 'stripe' && !isStripeReady)
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {processing || isProcessingPayment ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        'Place Order'
                    )}
                </button>

                {/* Error List */}
                {
                    Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                            <p className="text-red-700 text-sm font-medium">Please fix the following errors:</p>
                            <ul className="list-disc list-inside text-red-600 text-sm mt-1">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </form>
            </div>
            </UserLayout>
    );
}

export default function OrderForm() {
    return (
        <Elements stripe={stripePromise}>
            <StripeFormComponent />
        </Elements>
    );
}
