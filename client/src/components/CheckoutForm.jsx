import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import API from '../api';

const CheckoutForm = ({ slotId, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setProcessing(false);
            return;
        }

        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // Avoid redirect for demo simplicity
        });

        if (paymentError) {
            setError(paymentError.message);
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment success, create booking
            try {
                await API.post('/bookings', { slotId, paymentIntentId: paymentIntent.id });
                onSuccess();
            } catch (err) {
                setError('Payment succeeded but booking failed.');
            }
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

            <div className="flex gap-4 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={processing}
                    className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg disabled:opacity-50"
                >
                    {processing ? 'Processing...' : 'Pay & Book'}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
