import React from 'react';
import UserLayout from '@/Layouts/UserLayout';

const Cancel = ({ orderId }) => {
  return (
    <UserLayout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Payment Canceled</h2>
        <p>Your payment for order #{orderId} was canceled. Please try again.</p>
        <a
          href="/cart"
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Return to Cart
        </a>
      </div>
    </UserLayout>
  );
};

export default Cancel;