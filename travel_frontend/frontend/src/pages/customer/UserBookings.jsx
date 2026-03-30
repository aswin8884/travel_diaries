import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, Utensils, Calendar, XCircle, AlertCircle } from 'lucide-react';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [cancelMessage, setCancelMessage] = useState('');

    useEffect(() => {
        // Load bookings from local storage
        const savedBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
        setBookings(savedBookings);
    }, []);

    const handleCancel = (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        // Filter out the cancelled booking
        const updatedBookings = bookings.filter(b => b.id !== id);
        setBookings(updatedBookings);
        localStorage.setItem('user_bookings', JSON.stringify(updatedBookings));

        // Show refund message
        setCancelMessage("Booking cancelled successfully. Refund will be credited within 2 working days.");
        
        // Hide message after 5 seconds
        setTimeout(() => setCancelMessage(''), 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><Briefcase size={32} /></div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">My Trips</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your upcoming stays and dining reservations.</p>
                    </div>
                </div>

                {/* 🔥 Refund Alert Message 🔥 */}
                {cancelMessage && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in">
                        <AlertCircle size={20} />
                        <span className="font-bold">{cancelMessage}</span>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-16 text-center">
                        <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No active bookings</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't booked any adventures yet.</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors">Start Exploring</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
                                
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`p-4 rounded-2xl ${booking.type === 'hotel' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                                        {booking.type === 'hotel' ? <Building size={32}/> : <Utensils size={32}/>}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Booked on {booking.bookingDate}</div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-1">{booking.item.name}</h3>
                                        {booking.type === 'hotel' ? (
                                            <p className="text-gray-500 font-medium flex items-center gap-2"><Calendar size={16}/> {booking.checkIn} to {booking.checkOut}</p>
                                        ) : (
                                            <p className="text-gray-500 font-medium">Dining Reservation</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-sm font-bold text-gray-400">Total Paid</p>
                                        <p className="text-2xl font-black text-gray-900">₹{booking.total}</p>
                                    </div>
                                    <button onClick={() => handleCancel(booking.id)} className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl font-bold transition-colors">
                                        <XCircle size={18}/> Cancel Booking
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBookings;