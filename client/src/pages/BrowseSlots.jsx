import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import { io } from 'socket.io-client';

const BrowseSlots = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchSlots();

        // Socket.io for Real-Time Updates (Phase 5)
        // Connecting to server root
        const socket = io('http://localhost:5000');

        socket.on('slot-update', ({ slotId, action }) => {
            if (action === 'booked') {
                setSlots((prev) => prev.filter(s => s._id !== slotId));
            }
        });

        return () => socket.disconnect();
    }, []);

    const fetchSlots = async () => {
        try {
            const { data } = await API.get('/slots');
            setSlots(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch slots', err);
            setLoading(false);
        }
    };

    const handleBookClick = (slot) => {
        setSelectedSlot(slot);
    };

    const handleBookingSuccess = () => {
        alert('Booking Confirmed!');
        setSelectedSlot(null);
        fetchSlots(); // Refresh list (though socket should handle it)
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">
                    Find a Slot
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400">Visitor: {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading slots...</p>
            ) : slots.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-gray-500 text-xl">No slots available right now.</p>
                    <p className="text-gray-600 mt-2">Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {slots.map((slot) => (
                        <div
                            key={slot._id}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-pink-500/30 transition-all cursor-default"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-pink-500/20 text-pink-300 text-xs px-2 py-1 rounded uppercase tracking-wide font-bold">
                                    Available
                                </span>
                                <span className="text-green-400 font-bold">$10.00</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{slot.time}</h3>
                            <p className="text-gray-400 mb-2">{slot.date}</p>
                            <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs text-white uppercase font-bold">
                                    {slot.hostId?.name?.[0] || 'H'}
                                </div>
                                <span>Host: {slot.hostId?.name}</span>
                            </div>

                            <button
                                onClick={() => handleBookClick(slot)}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-colors shadow-lg active:scale-95"
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedSlot && (
                <BookingModal
                    slot={selectedSlot}
                    onClose={() => setSelectedSlot(null)}
                    onBookingSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default BrowseSlots;
