import React from 'react';
import UserLayout from '@/Layouts/UserLayout';

export default function ThankYou() {
    return (
        <UserLayout>
            <div className="max-w-xl mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold mb-4 text-green-700">Thank You!</h1>
                <p className="text-lg text-gray-700">Your order has been placed successfully.</p>
            </div>
        </UserLayout>
    );
}
