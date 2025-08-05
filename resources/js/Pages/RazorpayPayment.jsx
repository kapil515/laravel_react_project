import React, { useEffect, useState } from "react";
import { useForm, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";

export default function RazorpayPayment({
    order,
    razorpay_order_id,
    razorpay_key,
    amount,
    currency,
    user,
}) {
    const { setData, post, processing, errors } = useForm({
        razorpay_payment_id: "",
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: "",
    });

    const [scriptError, setScriptError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    const loadRazorpayScript = (callback) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => callback();
        script.onerror = () => {
            setScriptError("Failed to load Razorpay script. Please try again.");
            if (retryCount < maxRetries) setRetryCount(retryCount + 1);
        };
        document.body.appendChild(script);
        return script;
    };

    useEffect(() => {
        if (!razorpay_key || !razorpay_order_id || !amount) {
            setScriptError("Invalid Razorpay configuration.");
            return;
        }

        const openRazorpay = () => {
            if (window.Razorpay) {
                const options = {
                    key: razorpay_key,
                    amount: amount,
                    currency: currency,
                    order_id: razorpay_order_id,
                    name: "Your Company Name",
                    description: `Payment for Order #${order.id}`,
                    handler: function (response) {
                        if (
                            !response.razorpay_payment_id ||
                            !response.razorpay_order_id ||
                            !response.razorpay_signature
                        ) {
                            setScriptError("Incomplete payment response.");
                            router.visit(route("orders.thankyou", order.id));
                            return;
                        }

                        router.post(route("payment.razorpay.callback"), {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone || "",
                    },
                    theme: {
                        color: "#F37254",
                    },
                };

                const rzp = new window.Razorpay(options);

                rzp.on("payment.failed", function (response) {
                    setScriptError(
                        `Payment failed: ${response.error.description}`
                    );
                    router.visit(route("orders.thankyou", order.id));
                });

                rzp.open();
            } else {
                setScriptError("Razorpay SDK not available. Please try again.");
            }
        };

        let script;
        if (retryCount < maxRetries) {
            script = loadRazorpayScript(openRazorpay);
        } else {
            setScriptError("Maximum retries reached. Try again later.");
        }

        return () => {
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, [
        razorpay_key,
        razorpay_order_id,
        amount,
        currency,
        user,
        order.id,
        retryCount,
    ]);

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    Processing Razorpay Payment
                </h1>
                {scriptError ? (
                    <>
                        <p className="text-red-500 mb-4">{scriptError}</p>
                        <button
                            onClick={() =>
                                router.get(route("payment.razorpay", order.id))
                            }
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            disabled={processing}
                        >
                            Retry Payment
                        </button>
                    </>
                ) : (
                    <p>Please complete the payment in the Razorpay window.</p>
                )}
                {errors.razorpay_payment_id && (
                    <p className="text-red-500 mt-4">
                        {errors.razorpay_payment_id}
                    </p>
                )}
            </div>
        </UserLayout>
    );
}
