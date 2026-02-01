import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed w-full z-50 backdrop-blur-lg bg-black/50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                                MeetEase
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/40 via-black to-black"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        Scheduling made <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-pulse">
                            effortless & sync
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        The premium appointment booking platform for professionals. Real-time availability, instant payments, and seamless coordination.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105"
                        >
                            Start for Free
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-zinc-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why MeetEase?</h2>
                        <p className="text-gray-400">Everything you need to manage your time effectively.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Real-Time Sync',
                                description: 'Slots update instantly across all devices using advanced WebSocket technology.',
                                icon: '⚡',
                            },
                            {
                                title: 'Instant Payments',
                                description: 'Integrated secure payments via Stripe. Book and pay in a single click.',
                                icon: '💳',
                            },
                            {
                                title: 'Role-Based Flow',
                                description: 'Dedicated dashboards for Hosts to manage slots and Visitors to browse & book.',
                                icon: 'busts_in_silhouette',
                            },
                        ].map((feature, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-black border border-white/10 hover:border-pink-500/30 transition-colors">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About/CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-8">Ready to streamline your schedule?</h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join thousands of users who trust MeetEase for their appointment needs.
                        No credit card required for sign up.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition-transform active:scale-95"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} MeetEase. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
