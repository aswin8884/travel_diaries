import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, XCircle, Building, Utensils } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const map = {
        Confirmed: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
        Pending:   'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900',
        Cancelled: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900',
    };
    const icons = { Confirmed: CheckCircle, Pending: Clock, Cancelled: XCircle };
    const Icon = icons[status] || Clock;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${map[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>
            <Icon size={11}/> {status}
        </span>
    );
};

const EmptyState = ({ icon: Icon, title, desc }) => (
    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <Icon className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={36}/>
        <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">{title}</h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{desc}</p>
    </div>
);

const BookingsTab = () => {
    const [hotelBookings, setHotelBookings] = useState([]);
    const [restaurantBookings, setRestaurantBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubTab, setActiveSubTab] = useState('hotels');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get('http://localhost:8000/api/admin/bookings/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHotelBookings(res.data.hotel_bookings || []);
                setRestaurantBookings(res.data.restaurant_bookings || []);
            } catch (e) {
                console.error("Failed to fetch bookings", e);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const thCls = "px-5 py-3.5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider text-left";
    const tdCls = "px-5 py-4";

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm animate-in fade-in duration-500 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600"/> All Bookings
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Track and manage all customer reservations.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-3 py-1.5 rounded-xl font-bold text-xs">
                        Hotels: {hotelBookings.length}
                    </span>
                    <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900 px-3 py-1.5 rounded-xl font-bold text-xs">
                        Restaurants: {restaurantBookings.length}
                    </span>
                </div>
            </div>

            {/* Sub-tab */}
            <div className="flex gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => setActiveSubTab('hotels')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'hotels' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <Building size={15}/> Hotel Bookings
                </button>
                <button onClick={() => setActiveSubTab('restaurants')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'restaurants' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <Utensils size={15}/> Restaurant Bookings
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : activeSubTab === 'hotels' ? (
                    hotelBookings.length === 0
                        ? <EmptyState icon={Building} title="No hotel bookings yet" desc="Bookings will appear here once customers reserve rooms."/>
                        : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className={thCls}>Ref</th>
                                            <th className={thCls}>Guest</th>
                                            <th className={thCls}>Hotel</th>
                                            <th className={thCls}>Dates</th>
                                            <th className={thCls}>Rooms</th>
                                            <th className={thCls}>Amount</th>
                                            <th className={thCls}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                                        {hotelBookings.map(b => (
                                            <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className={`${tdCls} font-mono font-bold text-blue-600 dark:text-blue-400 text-xs`}>{b.booking_reference}</td>
                                                <td className={tdCls}>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{b.guest_name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{b.guest_email}</p>
                                                </td>
                                                <td className={`${tdCls} font-bold text-gray-700 dark:text-gray-300 text-sm`}>{b.hotel_name}</td>
                                                <td className={tdCls}>
                                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{b.check_in}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">→ {b.check_out}</p>
                                                </td>
                                                <td className={`${tdCls} font-bold text-gray-700 dark:text-gray-300 text-sm`}>{b.rooms}</td>
                                                <td className={`${tdCls} font-black text-gray-900 dark:text-white text-sm`}>₹{b.total_price}</td>
                                                <td className={tdCls}><StatusBadge status={b.status}/></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                ) : (
                    restaurantBookings.length === 0
                        ? <EmptyState icon={Utensils} title="No restaurant bookings yet" desc="Table reservations will appear here."/>
                        : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className={thCls}>Ref</th>
                                            <th className={thCls}>Guest</th>
                                            <th className={thCls}>Restaurant</th>
                                            <th className={thCls}>Date & Time</th>
                                            <th className={thCls}>Guests</th>
                                            <th className={thCls}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                                        {restaurantBookings.map(b => (
                                            <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className={`${tdCls} font-mono font-bold text-orange-500 dark:text-orange-400 text-xs`}>{b.booking_reference}</td>
                                                <td className={tdCls}>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{b.guest_name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{b.guest_email}</p>
                                                </td>
                                                <td className={`${tdCls} font-bold text-gray-700 dark:text-gray-300 text-sm`}>{b.restaurant_name}</td>
                                                <td className={tdCls}>
                                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{b.reservation_date}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">at {b.reservation_time}</p>
                                                </td>
                                                <td className={`${tdCls} font-bold text-gray-700 dark:text-gray-300 text-sm`}>{b.number_of_guests}</td>
                                                <td className={tdCls}><StatusBadge status={b.status}/></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

export default BookingsTab;
