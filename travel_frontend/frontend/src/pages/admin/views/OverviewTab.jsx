import { useState, useEffect } from 'react';
import { IndianRupee, MapPin, MessageSquare, TrendingUp, CalendarCheck, Star, Users } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../../../context/ThemeContext.jsx';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-5`}>
        <div className={`${bg} p-4 rounded-2xl ${color} shrink-0`}>
            <Icon size={26} strokeWidth={2}/>
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

const OverviewTab = ({ destinationsCount, usersCount }) => {
    const { isDark } = useTheme();
    const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const headers = { Authorization: `Bearer ${token}` };

                const [bookingsRes, feedbacksRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/admin/bookings/', { headers }),
                    axios.get('http://localhost:8000/api/feedback/', { headers }).catch(() => ({ data: [] }))
                ]);

                const hotelBookings = bookingsRes.data.hotel_bookings || [];
                const restaurantBookings = bookingsRes.data.restaurant_bookings || [];
                const bookings = [...hotelBookings, ...restaurantBookings];
                const fetchedFeedbacks = feedbacksRes.data.results || feedbacksRes.data;

                let calcTotalRevenue = 0;
                // Use ISO date string as map key so entries sort chronologically (YYYY-MM-DD).
                // A separate display label (e.g. "Apr 1") is stored alongside the revenue total.
                const revenueByDate = {};
                const bookingsByLocation = {};

                bookings.forEach(booking => {
                    const price = parseFloat(booking.total_price || 0);
                    const adminCut = price * 0.20;
                    calcTotalRevenue += adminCut;

                    const dateObj = new Date(booking.created_at);
                    const isoKey = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD" — sortable
                    const label = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                    if (!revenueByDate[isoKey]) revenueByDate[isoKey] = { label, total: 0 };
                    revenueByDate[isoKey].total += adminCut;

                    const locName = booking.hotel_name || booking.restaurant_name || 'Unknown';
                    bookingsByLocation[locName] = (bookingsByLocation[locName] || 0) + 1;
                });

                setStats({ totalRevenue: calcTotalRevenue, totalBookings: bookings.length });

                // Sort ascending by ISO key so the chart reads left-to-right chronologically.
                setRevenueData(
                    Object.entries(revenueByDate)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([, { label, total }]) => ({ date: label, revenue: Math.round(total) }))
                );
                setLocationData(Object.entries(bookingsByLocation).map(([name, bookings]) => ({ name, bookings })).sort((a, b) => b.bookings - a.bookings));
                setFeedbacks(fetchedFeedbacks);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Build rating distribution for pie chart
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(fb => { if (fb.rating >= 1 && fb.rating <= 5) ratingCounts[Math.round(fb.rating)]++; });
    const totalFeedbacks = feedbacks.length;
    const PIE_COLORS = { 5: '#10b981', 4: '#3b82f6', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };
    const ratingPieData = [5, 4, 3, 2, 1]
        .filter(r => ratingCounts[r] > 0)
        .map(r => ({
            name: `${r} Star${r > 1 ? 's' : ''}`,
            value: ratingCounts[r],
            pct: totalFeedbacks > 0 ? Math.round((ratingCounts[r] / totalFeedbacks) * 100) : 0,
            color: PIE_COLORS[r],
        }));

    const gridColor   = isDark ? '#374151' : '#f0f0f0';
    const tickColor   = isDark ? '#6b7280' : '#9ca3af';
    const cursorColor = isDark ? '#1f2937' : '#f9fafb';
    const chartTooltipStyle = {
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        backgroundColor: isDark ? '#111827' : '#ffffff',
        color: isDark ? '#f9fafb' : '#111827',
        boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
        fontSize: '13px',
        fontWeight: 'bold',
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard icon={IndianRupee} label="Admin Revenue (20%)" value={`₹${Math.round(stats.totalRevenue).toLocaleString()}`} bg="bg-emerald-50 dark:bg-emerald-950/40" color="text-emerald-600 dark:text-emerald-400"/>
                <StatCard icon={CalendarCheck} label="Total Bookings" value={stats.totalBookings} bg="bg-blue-50 dark:bg-blue-950/40" color="text-blue-600 dark:text-blue-400"/>
                <StatCard icon={MapPin} label="Destinations" value={destinationsCount} bg="bg-violet-50 dark:bg-violet-950/40" color="text-violet-600 dark:text-violet-400"/>
                <StatCard icon={Users} label="Registered Users" value={usersCount} bg="bg-orange-50 dark:bg-orange-950/40" color="text-orange-500 dark:text-orange-400"/>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-7 rounded-2xl shadow-sm">
                    <h3 className="text-base font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500"/> Revenue Over Time
                    </h3>
                    <div className="h-64">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize:11}}/>
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize:11}} tickFormatter={v => `₹${v}`}/>
                                    <Tooltip contentStyle={chartTooltipStyle} formatter={v => [`₹${v}`, 'Revenue']}/>
                                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r:4}} activeDot={{r:7}}/>
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">No revenue data yet.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-7 rounded-2xl shadow-sm">
                    <h3 className="text-base font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MapPin size={18} className="text-blue-500"/> Bookings by Property
                    </h3>
                    <div className="h-64">
                        {locationData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={locationData} layout="vertical" margin={{left:10}}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor}/>
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize:11}}/>
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize:11, fontWeight:'bold'}} width={80}/>
                                    <Tooltip cursor={{fill: cursorColor}} contentStyle={chartTooltipStyle}/>
                                    <Bar dataKey="bookings" fill="#3b82f6" radius={[0,8,8,0]} barSize={20}/>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">No booking data yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Feedback list — takes 2/3 */}
                <div className="xl:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-7 rounded-2xl shadow-sm">
                    <h3 className="text-base font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MessageSquare size={18} className="text-orange-500"/> Recent User Feedback
                    </h3>
                    {feedbacks.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 hide-scrollbar">
                            {feedbacks.map((fb, i) => (
                                <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-4 items-start">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                                        {(fb.author_initial || fb.author_name?.[0] || '?').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1 gap-2">
                                            <span className="font-bold text-gray-900 dark:text-white text-sm truncate">{fb.author_name || 'Anonymous'}</span>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {[...Array(5)].map((_,j) => (
                                                    <Star key={j} size={11} fill={j < fb.rating ? 'currentColor' : 'none'} className={j < fb.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}/>
                                                ))}
                                                <span className="text-xs text-gray-400 ml-1">{new Date(fb.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{fb.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 font-medium text-sm">
                            No feedback has been submitted yet.
                        </div>
                    )}
                </div>

                {/* Ratings Pie Chart — takes 1/3 */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-7 rounded-2xl shadow-sm flex flex-col">
                    <h3 className="text-base font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Star size={18} className="text-yellow-400"/> Rating Breakdown
                    </h3>
                    {ratingPieData.length > 0 ? (
                        <>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ratingPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {ratingPieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} stroke="none"/>
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={chartTooltipStyle}
                                            formatter={(value, name) => [`${value} review${value !== 1 ? 's' : ''}`, name]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {ratingPieData.map((entry, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor: entry.color}}></span>
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{entry.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                <div className="h-full rounded-full" style={{width: `${entry.pct}%`, backgroundColor: entry.color}}></div>
                                            </div>
                                            <span className="font-black text-gray-900 dark:text-white w-10 text-right">{entry.pct}%</span>
                                        </div>
                                    </div>
                                ))}
                                <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 text-center font-medium">{totalFeedbacks} total review{totalFeedbacks !== 1 ? 's' : ''}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium">
                            No ratings yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
