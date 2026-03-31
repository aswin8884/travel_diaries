import { useState, useEffect } from 'react';
import { DollarSign, MapPin, MessageSquare, TrendingUp, CalendarCheck } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OverviewTab = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalBookings: 0,
    });
    const [revenueData, setRevenueData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch real bookings and feedbacks from your Django backend
                const [bookingsRes, feedbacksRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/admin/bookings/', { headers }),
                    axios.get('http://localhost:8000/api/feedback/', { headers }).catch(() => ({ data: [] }))
                ]);

                // Combine hotel + restaurant bookings
                const hotelBookings = bookingsRes.data.hotel_bookings || [];
                const restaurantBookings = bookingsRes.data.restaurant_bookings || [];
                const bookings = [...hotelBookings, ...restaurantBookings];
                const fetchedFeedbacks = feedbacksRes.data.results || feedbacksRes.data;

                // --- 1. CALCULATE 20% REVENUE & TOTALS ---
                let calcTotalRevenue = 0;
                const revenueByDate = {};
                const bookingsByLocation = {};

                bookings.forEach(booking => {
                    // Assuming booking object has: price (or total_price), created_at, and destination_name
                    const bookingPrice = parseFloat(booking.total_price || booking.price || 0);
                    
                    // 🔥 Admin gets 20% commission
                    const adminCut = bookingPrice * 0.20; 
                    calcTotalRevenue += adminCut;

                    // --- 2. FORMAT DATA FOR REVENUE GRAPH ---
                    // Extract just the date (YYYY-MM-DD)
                    const date = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (!revenueByDate[date]) revenueByDate[date] = 0;
                    revenueByDate[date] += adminCut;

                    // --- 3. FORMAT DATA FOR LOCATION GRAPH ---
                    // Group by destination name
                    const locName = booking.destination_name || 'Unknown';
                    if (!bookingsByLocation[locName]) bookingsByLocation[locName] = 0;
                    bookingsByLocation[locName] += 1;
                });

                // Convert grouped objects into arrays for Recharts
                const formattedRevenueData = Object.keys(revenueByDate).map(date => ({
                    date,
                    revenue: revenueByDate[date]
                }));

                const formattedLocationData = Object.keys(bookingsByLocation).map(name => ({
                    name,
                    bookings: bookingsByLocation[name]
                })).sort((a, b) => b.bookings - a.bookings); // Sort highest to lowest

                setStats({
                    totalRevenue: calcTotalRevenue,
                    totalBookings: bookings.length,
                });
                setRevenueData(formattedRevenueData);
                setLocationData(formattedLocationData);
                setFeedbacks(fetchedFeedbacks);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-bold">Loading Live Data...</div>;

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            
            {/* --- TOP STAT CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="bg-green-100 p-5 rounded-2xl text-green-600">
                        <DollarSign size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Admin Revenue (20%)</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="bg-blue-100 p-5 rounded-2xl text-blue-600">
                        <CalendarCheck size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Platform Bookings</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">{stats.totalBookings}</h3>
                    </div>
                </div>
            </div>

            {/* --- GRAPHS SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue Line Chart */}
                <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="text-green-500"/> Revenue Over Time</h3>
                    <div className="h-72 w-full">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-medium">No revenue data yet.</div>
                        )}
                    </div>
                </div>

                {/* Popular Locations Bar Chart */}
                <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><MapPin className="text-blue-500"/> Bookings By Location</h3>
                    <div className="h-72 w-full">
                        {locationData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={locationData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 'bold'}} />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="bookings" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-medium">No booking data yet.</div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- USER FEEDBACK SECTION --- */}
            <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><MessageSquare className="text-orange-500"/> Recent User Feedback</h3>
                
                {feedbacks.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
                        {feedbacks.map((feedback, index) => (
                            <div key={index} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-900">{feedback.user_name || "Guest"}</span>
                                    <span className="text-xs font-bold text-gray-400">{new Date(feedback.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{feedback.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 font-medium">
                        No feedback has been submitted yet.
                    </div>
                )}
            </div>

        </div>
    );
};

export default OverviewTab;