import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, XCircle, Building, Utensils } from 'lucide-react';

const BookingsTab = () => {
    const [hotelBookings, setHotelBookings] = useState([]);
    const [restaurantBookings, setRestaurantBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [activeSubTab, setActiveSubTab] = useState('hotels');

    useEffect(() => {
        const fetchBookings = async () => {
            setLoadingBookings(true);
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get('http://localhost:8000/api/admin/bookings/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHotelBookings(res.data.hotel_bookings || []);
                setRestaurantBookings(res.data.restaurant_bookings || []);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoadingBookings(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed':
                return <span className="flex w-max items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100"><CheckCircle size={12}/> Confirmed</span>;
            case 'Pending':
                return <span className="flex w-max items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100"><Clock size={12}/> Pending</span>;
            case 'Cancelled':
                return <span className="flex w-max items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100"><XCircle size={12}/> Cancelled</span>;
            default:
                return <span className="flex w-max bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 shadow-sm p-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Calendar className="text-blue-600" /> All Bookings
                    </h2>
                    <p className="text-gray-500 font-medium text-sm mt-1">Manage and track all customer reservations.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm">
                        Hotels: {hotelBookings.length}
                    </div>
                    <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl font-bold text-sm">
                        Restaurants: {restaurantBookings.length}
                    </div>
                </div>
            </div>

            {/* Sub-tab toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveSubTab('hotels')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'hotels' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <Building size={16} /> Hotel Bookings
                </button>
                <button
                    onClick={() => setActiveSubTab('restaurants')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'restaurants' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <Utensils size={16} /> Restaurant Bookings
                </button>
            </div>

            {loadingBookings ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : activeSubTab === 'hotels' ? (
                /* ======== HOTEL BOOKINGS TABLE ======== */
                hotelBookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Building className="mx-auto text-gray-400 mb-3" size={32} />
                        <h3 className="text-lg font-bold text-gray-900">No hotel bookings yet</h3>
                        <p className="text-gray-500 font-medium text-sm">When customers book hotels, they will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider rounded-tl-xl">Ref</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hotel</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rooms</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {hotelBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-bold text-blue-600 text-sm">{booking.booking_reference}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900 text-sm">{booking.guest_name || 'Guest'}</p>
                                            <p className="text-xs text-gray-500 font-medium">{booking.guest_email}</p>
                                        </td>
                                        <td className="p-4 font-bold text-gray-700 text-sm">{booking.hotel_name}</td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-900 text-sm">{booking.check_in}</p>
                                            <p className="text-xs text-gray-400 font-medium">to {booking.check_out}</p>
                                        </td>
                                        <td className="p-4 font-bold text-gray-700 text-sm">{booking.rooms}</td>
                                        <td className="p-4 font-black text-gray-900">{booking.total_price}</td>
                                        <td className="p-4">{getStatusBadge(booking.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                /* ======== RESTAURANT BOOKINGS TABLE ======== */
                restaurantBookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Utensils className="mx-auto text-gray-400 mb-3" size={32} />
                        <h3 className="text-lg font-bold text-gray-900">No restaurant bookings yet</h3>
                        <p className="text-gray-500 font-medium text-sm">When customers reserve tables, they will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider rounded-tl-xl">Ref</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Restaurant</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guests</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {restaurantBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-bold text-orange-600 text-sm">{booking.booking_reference}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900 text-sm">{booking.guest_name || 'Guest'}</p>
                                            <p className="text-xs text-gray-500 font-medium">{booking.guest_email}</p>
                                        </td>
                                        <td className="p-4 font-bold text-gray-700 text-sm">{booking.restaurant_name}</td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-900 text-sm">{booking.reservation_date}</p>
                                            <p className="text-xs text-gray-400 font-medium">at {booking.reservation_time}</p>
                                        </td>
                                        <td className="p-4 font-bold text-gray-700 text-sm">{booking.number_of_guests}</td>
                                        <td className="p-4 font-black text-gray-900">{booking.total_price}</td>
                                        <td className="p-4">{getStatusBadge(booking.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default BookingsTab;
