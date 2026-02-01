import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import API from '../api';
import CheckoutForm from './CheckoutForm';

// Replace with your actual Publishable Key
const stripePromise = loadStripe('pk_test_51SvupsJD3vESP8jjaUjaWiaiPhIE6oh7Jk4Cubp99vaMu0AaziuTJdMFAa6UCEqbnQZ0z6Lcg6YWNecukMLHNLNV00aoEtRPWx'); // User needs to provide this

const BookingModal = ({ slot, onClose, onBookingSuccess }) => {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Create PaymentIntent as soon as the modal loads
        const createIntent = async () => {
            try {
                const { data } = await API.post('/bookings/create-payment-intent', { slotId: slot._id });
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error('Failed to init payment');
            }
        };
        createIntent();
    }, [slot]);

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#ec4899',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">
                    Book Appointment
                </h2>
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-sm">Date & Time</p>
                    <p className="text-lg font-semibold text-white">{slot.date} at {slot.time}</p>
                    <p className="text-gray-400 text-sm mt-2">Price</p>
                    <p className="text-lg font-semibold text-green-400">$10.00</p>
                </div>

                {clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm slotId={slot._id} onSuccess={onBookingSuccess} onCancel={onClose} />
                    </Elements>
                ) : (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
