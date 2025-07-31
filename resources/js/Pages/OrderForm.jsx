import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function OrderForm() {
  const { data, setData, post, processing, errors } = useForm({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    payment_method: 'cod',
    cart: [], 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('orders.store'));
    
  };

  return (
    <UserLayout>
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Shipping Address</h2>

      <input
        type="text"
        placeholder="Address"
        value={data.address_line1}
        onChange={(e) => setData('address_line1', e.target.value)}
        className="w-full border p-2"
      />
      <input
        type="text"
        placeholder="Apartment, suite, etc."
        value={data.address_line2}
        onChange={(e) => setData('address_line2', e.target.value)}
        className="w-full border p-2"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="City"
          value={data.city}
          onChange={(e) => setData('city', e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Country"
          value={data.country}
          onChange={(e) => setData('country', e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="State"
          value={data.state}
          onChange={(e) => setData('state', e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={data.postal_code}
          onChange={(e) => setData('postal_code', e.target.value)}
          className="border p-2"
        />
      </div>

      <select
        value={data.payment_method}
        onChange={(e) => setData('payment_method', e.target.value)}
        className="border p-2 w-full"
      >
        <option value="cod">Cash on Delivery</option>
        <option value="paypal">PayPal</option>
        <option value="card">Credit/Debit Card</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={processing}
      >
        {processing ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
    </UserLayout>
  );
}
