import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, XCircle, Info, Building, Utensils } from 'lucide-react';

const MyTrips = () => {
    const [hotelBookings, setHotelBookings] = useState([]);
    const [restaurantBookings, setRestaurantBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelMessage, setCancelMessage] = useState('');
    const [activeTab, setActiveTab] = useState('hotels');

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = { Authorization: `Bearer ${token}` };

            const [hotelRes, restaurantRes] = await Promise.all([
                axios.get('http://localhost:8000/api/hotel-bookings/my-bookings/', { headers }),
                axios.get('http://localhost:8000/api/restaurant-bookings/my-bookings/', { headers })
            ]);

            setHotelBookings(hotelRes.data);
            setRestaurantBookings(restaurantRes.data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelHotel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this hotel booking?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.patch(`http://localhost:8000/api/hotel-bookings/${bookingId}/`, {
                status: 'Cancelled'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCancelMessage("Booking successfully cancelled. Your refund will credit within 2 working days.");
            fetchAllBookings();
            setTimeout(() => setCancelMessage(''), 5000);
        } catch (error) {
            console.error("Failed to cancel", error);
            alert("Failed to cancel booking. Please contact support.");
        }
    };

    const handleCancelRestaurant = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.patch(`http://localhost:8000/api/restaurant-bookings/${bookingId}/`, {
                status: 'Cancelled'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCancelMessage("Reservation successfully cancelled.");
            fetchAllBookings();
            setTimeout(() => setCancelMessage(''), 5000);
        } catch (error) {
            console.error("Failed to cancel", error);
            alert("Failed to cancel reservation. Please contact support.");
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    if (loading) return <div className="min-h-screen p-20 text-center font-bold text-gray-400">Loading your trips...</div>;

    const totalBookings = hotelBookings.length + restaurantBookings.length;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-2">My Trips</h1>
                <p className="text-gray-500 font-medium mb-8">All your hotel stays and restaurant reservations in one place.</p>

                {cancelMessage && (
                    <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-xl font-bold flex items-center gap-3 shadow-sm border border-green-200 animate-in fade-in slide-in-from-top-4">
                        <Info size={20} />
                        {cancelMessage}
                    </div>
                )}

                {totalBookings === 0 ? (
                    <div className="bg-white p-12 rounded-[2rem] shadow-sm text-center border border-gray-100">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-900 mb-2">No upcoming trips</h3>
                        <p className="text-gray-500 font-medium">Time to dust off your bags and start planning your next adventure.</p>
                    </div>
                ) : (
                    <>
                        {/* Tab toggle */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setActiveTab('hotels')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'hotels' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                            >
                                <Building size={16} /> Hotel Stays ({hotelBookings.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('restaurants')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'restaurants' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                            >
                                <Utensils size={16} /> Reservations ({restaurantBookings.length})
                            </button>
                        </div>

                        {/* Hotel Bookings */}
                        {activeTab === 'hotels' && (
                            <div className="space-y-6">
                                {hotelBookings.length === 0 ? (
                                    <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center border border-gray-100">
                                        <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-bold">No hotel bookings yet.</p>
                                    </div>
                                ) : (
                                    hotelBookings.map((booking) => (
                                        <div key={booking.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                            <div className="flex gap-4 items-start">
                                                {booking.hotel_image && (
                                                    <img src={getImageUrl(booking.hotel_image)} className="w-20 h-20 rounded-2xl object-cover shrink-0" alt="Hotel" />
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-black text-gray-900">{booking.hotel_name || `Booking #${booking.id}`}</h3>
                                                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                            {booking.status || 'Confirmed'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-blue-600 mb-2">{booking.booking_reference}</p>
                                                    <p className="text-sm font-bold text-gray-500 mb-1">Check-in: <span className="text-gray-900">{booking.check_in}</span> &mdash; Check-out: <span className="text-gray-900">{booking.check_out}</span></p>
                                                    <p className="text-sm font-bold text-gray-500">Rooms: <span className="text-gray-900">{booking.rooms}</span> &bull; Total: <span className="text-blue-600 font-black">{booking.total_price}</span></p>
                                                </div>
                                            </div>

                                            {booking.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => handleCancelHotel(booking.id)}
                                                    className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 shrink-0"
                                                >
                                                    <XCircle size={18} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Restaurant Bookings */}
                        {activeTab === 'restaurants' && (
                            <div className="space-y-6">
                                {restaurantBookings.length === 0 ? (
                                    <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center border border-gray-100">
                                        <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-bold">No restaurant reservations yet.</p>
                                    </div>
                                ) : (
                                    restaurantBookings.map((booking) => (
                                        <div key={booking.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                            <div className="flex gap-4 items-start">
                                                {booking.restaurant_image && (
                                                    <img src={getImageUrl(booking.restaurant_image)} className="w-20 h-20 rounded-2xl object-cover shrink-0" alt="Restaurant" />
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-black text-gray-900">{booking.restaurant_name || `Reservation #${booking.id}`}</h3>
                                                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                            {booking.status || 'Confirmed'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-orange-600 mb-2">{booking.booking_reference}</p>
                                                    <p className="text-sm font-bold text-gray-500 mb-1">Date: <span className="text-gray-900">{booking.reservation_date}</span> at <span className="text-gray-900">{booking.reservation_time}</span></p>
                                                    <p className="text-sm font-bold text-gray-500">Guests: <span className="text-gray-900">{booking.number_of_guests}</span> &bull; Total: <span className="text-orange-600 font-black">{booking.total_price}</span></p>
                                                </div>
                                            </div>

                                            {booking.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => handleCancelRestaurant(booking.id)}
                                                    className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 shrink-0"
                                                >
                                                    <XCircle size={18} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyTrips;
