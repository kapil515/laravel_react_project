import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Cart() {
    const { cartItems } = usePage().props;

    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelect = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;

        router.post(route('cart.update'), {
            product_id: id,
            quantity: newQuantity, 
        }, {
            preserveScroll: true,
        });
    };

    const handleRemove = (id) => {
        router.post(route('cart.remove', id), {}, {
            method: 'post',
            preserveScroll: true,
        });
    };

    const handleClear = () => {
        router.post(route('cart.clear'), {}, {
            method: 'post',
            preserveScroll: true,
        });
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    const handleCheckout = () => {
    if (cartItems.length === 1) {
       
        const onlyProductId = cartItems[0].id;
        router.post(route('checkout.selected'), {
            product_ids: [onlyProductId],
        });
        return;
    }

    if (selectedItems.length === 0) {
        alert("Please select at least one item to checkout.");
        return;
    }

    router.post(route('checkout.selected'), {
        product_ids: selectedItems,
    });
};


    return (
        <UserLayout>
            <div className="container mx-auto max-w-6xl px-4 py-10">
                <h1 className="text-4xl font-bold mb-10 text-gray-900">🛒 Your Cart</h1>

                {cartItems.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                    <div className="space-y-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center border p-4 rounded-lg shadow-md">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelect(item.id)}
                                    className="mr-4 w-5 h-5"
                                />
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="ml-4 flex-1">
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p className="text-gray-600">Price:  ₹{item.price}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="bg-gray-200 px-2 py-1 rounded"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                            className="w-20 text-center border rounded"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="bg-gray-200 px-2 py-1 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-sm mt-1 text-gray-500">Item Total:  ₹{item.price * item.quantity}</p>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-between items-center mt-6">
                            <h2 className="text-xl font-bold">Total:  ₹{getTotal()}</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleClear}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Checkout 
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
