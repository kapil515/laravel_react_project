import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function OrderForm() {
    const { cartItems, flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        payment_method: '',
        cart: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
        })),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('OrderForm submitting data:', data);
        post(route('orders.store'), {
            onSuccess: () => console.log('Order submission successful'),
            onError: (errors) => console.error('Order submission failed:', errors),
        });
    };

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-bold mb-6">Checkout</h2>
                {flash?.error && <p className="text-red-500 mb-4">{flash.error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Address Line 1"
                            value={data.address_line1}
                            onChange={e => setData('address_line1', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.address_line1 && <p className="text-red-500">{errors.address_line1}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Address Line 2 (Optional)"
                            value={data.address_line2}
                            onChange={e => setData('address_line2', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="City"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="w-full border p-2"
                            />
                            <p className="text-red-600 text-sm min-h-[1.25rem]">{errors.city}</p>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="State"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                                className="w-full border p-2"
                            />
                            <p className="text-red-600 text-sm min-h-[1.25rem]">{errors.state}</p>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Country"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                className="w-full border p-2"
                            />
                            <p className="text-red-600 text-sm min-h-[1.25rem]">{errors.country}</p>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={data.postal_code}
                                onChange={(e) => setData('postal_code', e.target.value)}
                                className="w-full border p-2"
                            />
                            <p className="text-red-600 text-sm min-h-[1.25rem]">{errors.postal_code}</p>
                        </div>
                    </div>
                    <select
                        value={data.payment_method}
                        onChange={e => setData('payment_method', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">Select Payment Method</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="online">Razorpay</option>
                        <option value="stripe">Stripe Payment</option>
                    </select>
                    <div className="mt-6">
                        <h3 className="font-bold mb-2">Selected Products:</h3>
                        <ul className="space-y-2">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex items-center gap-4">
                                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover" />
                                    <div>
                                        <p>{item.name}</p>
                                        <p>Qty: {item.quantity}</p>
                                        <p>Price:  ₹{item.price}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                    >
                        Place Order
                    </button>
                </form>
            </div>
        </UserLayout>
    );
}
