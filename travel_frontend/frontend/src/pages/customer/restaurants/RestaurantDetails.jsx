import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Utensils, Star, ArrowLeft, Users, CheckCircle, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [guests, setGuests] = useState(2);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // Booking flow state
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');

    // Gallery state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/restaurants/${id}/`)
            .then(res => setRestaurant(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    if (!restaurant) return <div className="h-screen flex items-center justify-center font-black text-gray-300 animate-pulse">Loading Restaurant...</div>;

    const today = new Date().toISOString().split('T')[0];
    const totalEstimate = restaurant.average_cost * guests;

    // Gallery logic
    const allImages = [restaurant.image, ...(restaurant.gallery_images?.map(g => g.image) || restaurant.images?.map(g => g.image) || [])];
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    const handleReserve = () => {
        if (!date || !time) {
            alert("Please select both a date and time for your reservation.");
            return;
        }
        setShowGuestForm(true);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert("Please log in to make a reservation.");
                navigate('/login');
                return;
            }

            const response = await axios.post('http://localhost:8000/api/restaurant-bookings/', {
                restaurant: restaurant.id,
                reservation_date: date,
                reservation_time: time,
                number_of_guests: parseInt(guests),
                guest_name: formData.name,
                guest_email: formData.email,
                guest_phone: formData.phone,
                total_price: totalEstimate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBookingRef(response.data.booking_reference || `RES-${Math.floor(Math.random() * 1000000)}`);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert("Please log in to make a reservation.");
                navigate('/login');
            } else {
                alert("Reservation failed. Please try again.");
            }
            setIsSubmitting(false);
        }
    };

    // Success screen
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="text-green-500 w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Reservation Confirmed!</h1>
                    <p className="text-gray-500 text-lg mb-8">Your table at <strong>{restaurant.name}</strong> is secured. A confirmation will be sent to {formData.email}.</p>

                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8 inline-block text-left w-full max-w-sm">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
                        <p className="text-2xl font-black text-orange-500 tracking-wider mb-4">{bookingRef}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-gray-700">
                                <span>Date:</span> <span>{date}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-700">
                                <span>Time:</span> <span>{time}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-700">
                                <span>Guests:</span> <span>{guests}</span>
                            </div>
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
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 hover:text-orange-500 transition-all">
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-8 h-[500px] group bg-gray-100">
                        <img src={getImageUrl(allImages[currentImageIndex])} className="w-full h-full object-cover transition-all duration-500" alt={restaurant.name} />
                        {allImages.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all text-gray-800">
                                    <ChevronLeft size={24} strokeWidth={3} />
                                </button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all text-gray-800">
                                    <ChevronRight size={24} strokeWidth={3} />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur px-6 py-3 rounded-3xl shadow-xl">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Cost</p>
                            <p className="text-3xl font-black text-orange-500">{restaurant.average_cost} <span className="text-sm text-gray-400">/person</span></p>
                        </div>
                    </div>

                    {/* Thumbnail strip */}
                    {allImages.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
                            {allImages.map((img, idx) => (
                                <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${currentImageIndex === idx ? 'border-orange-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                    <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2 mb-6">
                        <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100 flex items-center gap-1">
                            <Clock size={14}/> {restaurant.opening_time?.slice(0,5)} - {restaurant.closing_time?.slice(0,5)}
                        </span>
                        <span className="bg-yellow-50 text-yellow-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-100 flex items-center gap-1">
                            <Star size={14} fill="currentColor"/> {restaurant.rating || '0.0'} Rating
                        </span>
                        <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-100 flex items-center gap-1">
                            <CheckCircle size={14}/> Instant Reservation
                        </span>
                    </div>

                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-6">{restaurant.name}</h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">{restaurant.description}</p>
                </div>

                <div className="relative">
                    <div className="sticky top-10 bg-white border border-gray-100 p-10 rounded-[3.5rem] shadow-2xl shadow-orange-100">
                        {!showGuestForm ? (
                            <>
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2"><Utensils className="text-orange-500"/> Reserve Table</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Date</label>
                                        <input type="date" min={today} value={date} onChange={(e)=>setDate(e.target.value)} className="w-full bg-transparent font-bold outline-none cursor-pointer" />
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Time</label>
                                        <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="w-full bg-transparent font-bold outline-none cursor-pointer" />
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                        <label className="text-xs font-black text-gray-400 uppercase">Party Size</label>
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={()=>setGuests(Math.max(1, guests-1))} className="w-10 h-10 rounded-full bg-white border border-gray-200 font-black text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">-</button>
                                            <span className="font-black text-xl w-6 text-center">{guests}</span>
                                            <button type="button" onClick={()=>setGuests(Math.min(restaurant.max_guests_per_slot || 20, guests+1))} className="w-10 h-10 rounded-full bg-white border border-gray-200 font-black text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">+</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-100">
                                    <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">Total Estimate</span>
                                    <span className="text-3xl font-black text-gray-900">{totalEstimate}</span>
                                </div>

                                <button
                                    onClick={handleReserve}
                                    disabled={!date || !time}
                                    className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95"
                                >
                                    Confirm Reservation
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Guest Details</h3>
                                <p className="text-gray-500 text-sm font-medium mb-6">Complete your reservation at {restaurant.name}</p>

                                <form onSubmit={handleSubmitBooking} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold focus:border-orange-400 outline-none" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                        <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold focus:border-orange-400 outline-none" placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                                        <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold focus:border-orange-400 outline-none" placeholder="+1 234 567 890" />
                                    </div>

                                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-sm">
                                        <div className="flex justify-between font-bold text-gray-700 mb-1"><span>Date:</span><span>{date}</span></div>
                                        <div className="flex justify-between font-bold text-gray-700 mb-1"><span>Time:</span><span>{time}</span></div>
                                        <div className="flex justify-between font-bold text-gray-700 mb-1"><span>Guests:</span><span>{guests}</span></div>
                                        <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-orange-200 mt-2"><span>Total:</span><span>{totalEstimate}</span></div>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 disabled:bg-gray-400 transition-all flex justify-center items-center gap-2 text-lg">
                                        {isSubmitting ? 'Reserving...' : 'Complete Reservation'} <ShieldCheck size={20} />
                                    </button>
                                    <button type="button" onClick={() => setShowGuestForm(false)} className="w-full py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">
                                        Back to Details
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails;
