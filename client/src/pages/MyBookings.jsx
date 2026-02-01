import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await API.get('/bookings/my-bookings');
            setBookings(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Helper to check if a booking is in the past
    const isPast = (dateStr, timeStr) => {
        const bookingDate = new Date(`${dateStr}T${timeStr}`);
        const now = new Date();
        return bookingDate < now;
    };

    const upcomingBookings = bookings.filter(b => !isPast(b.slotId?.date, b.slotId?.time));
    const pastBookings = bookings.filter(b => isPast(b.slotId?.date, b.slotId?.time));

    const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    return (
        <div className="min-h-screen bg-black text-gray-100 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    My Bookings
                </h1>
                <div className="flex items-center gap-4">
                    <Link to="/browse-slots" className="text-gray-400 hover:text-white transition-colors">
                        &larr; Browse More
                    </Link>
                    <span className="text-gray-400">|</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-2 px-4 font-medium transition-colors relative ${activeTab === 'upcoming'
                            ? 'text-green-400'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    Upcoming
                    {activeTab === 'upcoming' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 rounded-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-2 px-4 font-medium transition-colors relative ${activeTab === 'history'
                            ? 'text-green-400'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    History
                    {activeTab === 'history' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 rounded-full"></span>
                    )}
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading bookings...</p>
            ) : displayedBookings.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-gray-500 text-xl">
                        {activeTab === 'upcoming'
                            ? "You have no upcoming bookings."
                            : "No booking history found."}
                    </p>
                    {activeTab === 'upcoming' && (
                        <Link to="/browse-slots" className="mt-4 inline-block px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors">
                            Find a Slot
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedBookings.map((booking) => (
                        <div
                            key={booking._id}
                            className={`backdrop-blur-sm border p-6 rounded-2xl transition-all ${activeTab === 'upcoming'
                                    ? 'bg-white/5 border-white/10 hover:border-green-500/30'
                                    : 'bg-white/5 border-white/5 opacity-75 grayscale hover:grayscale-0 hover:opacity-100'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs px-2 py-1 rounded uppercase tracking-wide font-bold ${activeTab === 'upcoming'
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {activeTab === 'upcoming' ? 'Confirmed' : 'Completed'}
                                </span>
                                <span className="text-gray-400 text-xs">ID: {booking._id.slice(-6)}</span>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">When</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-white">{booking.slotId?.time}</span>
                                    <span className="text-gray-400 mb-1">{booking.slotId?.date}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Host</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs text-white uppercase font-bold">
                                        {booking.hostId?.name?.[0] || 'H'}
                                    </div>
                                    <span className="text-white">{booking.hostId?.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-10">{booking.hostId?.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
