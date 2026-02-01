import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const HostDashboard = () => {
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ date: '', time: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const { data } = await API.get(`/slots?hostId=${user.id}`);
            setSlots(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch slots', err);
            setLoading(false);
        }
    };

    const handeCreateSlot = async (e) => {
        e.preventDefault();
        try {
            await API.post('/slots', newSlot);
            setNewSlot({ date: '', time: '' });
            fetchSlots();
        } catch (err) {
            alert('Failed to create slot');
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) return;
        try {
            await API.delete(`/slots/${id}`);
            fetchSlots();
        } catch (err) {
            alert('Failed to delete slot');
        }
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
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    Host Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400">Welcome, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Slot Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl sticky top-8">
                        <h2 className="text-2xl font-bold mb-6 text-white">Create New Slot</h2>
                        <form onSubmit={handeCreateSlot} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={newSlot.date}
                                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                                <input
                                    type="time"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={newSlot.time}
                                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 shadow-lg"
                            >
                                Add Slot
                            </button>
                        </form>
                    </div>
                </div>

                {/* Slots List */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 text-white">Your Slots</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading slots...</p>
                    ) : slots.length === 0 ? (
                        <p className="text-gray-500 italic">No slots created yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {slots.map((slot) => (
                                <div
                                    key={slot._id}
                                    className={`relative p-5 rounded-xl border transition-all ${slot.isBooked
                                            ? 'bg-green-900/20 border-green-500/30'
                                            : 'bg-white/5 border-white/10 hover:border-blue-500/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-lg font-bold text-white">{slot.time}</p>
                                            <p className="text-gray-400">{slot.date}</p>
                                        </div>
                                        {slot.isBooked ? (
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold uppercase tracking-wider">
                                                Booked
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full font-bold uppercase tracking-wider">
                                                Open
                                            </span>
                                        )}
                                    </div>

                                    {!slot.isBooked && (
                                        <button
                                            onClick={() => handleDeleteSlot(slot._id)}
                                            className="absolute bottom-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                                            title="Delete Slot"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HostDashboard;
