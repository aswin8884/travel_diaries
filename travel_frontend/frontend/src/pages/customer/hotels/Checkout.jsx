import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;

    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');

    if (!bookingData) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">No booking data found. Please select a hotel first.</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            // Change URL if your Django endpoint is different
            const response = await axios.post('http://localhost:8000/api/hotel-bookings/', {
                hotel: bookingData.hotelId,
                check_in: bookingData.checkIn,
                check_out: bookingData.checkOut,
                rooms: bookingData.rooms,
                guest_name: formData.name,
                guest_email: formData.email,
                guest_phone: formData.phone,
                total_price: bookingData.totalPrice
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBookingRef(response.data.booking_reference || `REF-${Math.floor(Math.random() * 1000000)}`);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Payment failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="text-green-500 w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Booking Confirmed!</h1>
                    <p className="text-gray-500 text-lg mb-8">Your reservation at <strong>{bookingData.hotelName}</strong> is secured. A confirmation email has been sent to {formData.email}.</p>
                    
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8 inline-block text-left w-full max-w-sm">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
                        <p className="text-2xl font-black text-blue-600 tracking-wider mb-4">{bookingRef}</p>
                        <div className="flex justify-between text-sm font-bold text-gray-700">
                            <span>Check-in:</span> <span>{bookingData.checkIn}</span>
                        </div>
                    </div>

                    <button onClick={() => navigate('/my-trips')} className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all">
                        View My Trips
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 hover:text-blue-600 transition-all">
                    <ArrowLeft size={20} /> Back to Property
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-8">Secure Checkout</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-4">Guest Details</h3>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold focus:border-blue-500 outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input required type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold focus:border-blue-500 outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                                <input required type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold focus:border-blue-500 outline-none" placeholder="+1 234 567 890" />
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-400 transition-all flex justify-center items-center gap-2 text-lg">
                            {isSubmitting ? 'Processing...' : `Pay ₹${bookingData.totalPrice}`} <ShieldCheck size={20} />
                        </button>
                        <p className="text-center text-xs font-bold text-gray-400 mt-4 flex items-center justify-center gap-1"><CreditCard size={14}/> Payments are secure and encrypted.</p>
                    </form>
                </div>

                <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 h-fit sticky top-10">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Booking Summary</h3>
                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                        <img src={bookingData.hotelImage} className="w-24 h-24 rounded-2xl object-cover" alt="Hotel" />
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hotel</p>
                            <p className="text-lg font-black text-gray-900">{bookingData.hotelName}</p>
                        </div>
                    </div>
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex justify-between"><span className="font-bold text-gray-500">Check-in</span><span className="font-black text-gray-900">{bookingData.checkIn}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500">Check-out</span><span className="font-black text-gray-900">{bookingData.checkOut}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500">Length of Stay</span><span className="font-black text-gray-900">{bookingData.nights} Night{bookingData.nights > 1 ? 's' : ''}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500">Rooms</span><span className="font-black text-gray-900">{bookingData.rooms} Room{bookingData.rooms > 1 ? 's' : ''}</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-gray-900">Total Price</span>
                        <span className="text-4xl font-black text-blue-600">₹{bookingData.totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;