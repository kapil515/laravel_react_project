import React from 'react';
import { Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

const Cancel = ({ orderId, message, retryUrl, cartUrl }) => {
    return (
        <UserLayout>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Payment Canceled</h2>
                <p className="mb-4">{message}</p>
                <div className="flex justify-between">
                    <Link
                        href={retryUrl}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Retry Payment
                    </Link>
                    <Link
                        href={cartUrl}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Back to Cart
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
};

export default Cancel;