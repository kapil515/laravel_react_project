import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
export const stripePromise = loadStripe("pk_test_51RsLRGQcdi2EgYJFurE6Hhsgw5REIUpEXuJDVwUin2kWXC59cuV0MOmcFnQfr4NrQ5Nvdx8UA8FPmv1IeUhSxHi000Be09Zzw9");

export default function StripeForm({ handleSubmit, data, setData, errors, cardError, processing, isStripeReady }) {
    const stripe = useStripe();
    const elements = useElements();

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Address Line 1 */}
            <input
                type="text"
                placeholder="Address Line 1"
                value={data.address_line1}
                onChange={e => setData('address_line1', e.target.value)}
                className="w-full border px-3 py-2 rounded"
            />
            {errors.address_line1 && <p className="text-red-500">{errors.address_line1}</p>}

            {/* ... repeat for City, State, etc. */}

            {/* Payment Method Select */}
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
            {errors.payment_method && <p className="text-red-500">{errors.payment_method}</p>}

            {/* Stripe Card Input */}
            {data.payment_method === 'stripe' && (
                <div className="border p-4 rounded">
                    <CardElement />
                    {cardError && <p className="text-red-500">{cardError}</p>}
                </div>
            )}

            <button
                type="submit"
                disabled={processing || (data.payment_method === 'stripe' && !isStripeReady)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Place Order
            </button>

        </form>
    );
}
