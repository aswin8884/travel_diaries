import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Utensils, Star, ArrowLeft, CheckCircle, ShieldCheck, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix default leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [guests, setGuests] = useState(2);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');
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

    if (!restaurant) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-gray-400 dark:text-gray-500 animate-pulse">Loading Restaurant...</p>
            </div>
        </div>
    );

    const today = new Date().toISOString().split('T')[0];
    const hasMap = restaurant.latitude && restaurant.longitude;

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
                total_price: 0
            }, { headers: { Authorization: `Bearer ${token}` } });

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

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-900 p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center border border-gray-100 dark:border-gray-800">
                    <div className="relative w-28 h-28 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-30"></div>
                        <div className="relative w-28 h-28 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="text-green-500 w-14 h-14" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Reservation Confirmed!</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">Your table at <strong className="text-gray-900 dark:text-white">{restaurant.name}</strong> is ready.</p>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 mb-8 text-left">
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Booking Reference</p>
                        <p className="text-2xl font-black text-orange-500 tracking-wider mb-4">{bookingRef}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                            <div><span className="text-gray-400 dark:text-gray-500 block text-xs uppercase tracking-widest">Date</span>{date}</div>
                            <div><span className="text-gray-400 dark:text-gray-500 block text-xs uppercase tracking-widest">Time</span>{time}</div>
                            <div><span className="text-gray-400 dark:text-gray-500 block text-xs uppercase tracking-widest">Party Size</span>{guests} Guests</div>
                        </div>
                    </div>

                    <button onClick={() => navigate('/my-trips')} className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white font-black rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all">
                        View My Trips
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all">
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-8 h-[500px] group bg-gray-100 dark:bg-gray-800">
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

                    <div className="flex gap-2 mb-6 flex-wrap">
                        <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900 flex items-center gap-1">
                            <Clock size={14}/> {restaurant.opening_time?.slice(0,5)} - {restaurant.closing_time?.slice(0,5)}
                        </span>
                        <span className="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-100 dark:border-yellow-900 flex items-center gap-1">
                            <Star size={14} fill="currentColor"/> {restaurant.rating || '0.0'} Rating
                        </span>
                        <span className="bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-100 dark:border-green-900 flex items-center gap-1">
                            <CheckCircle size={14}/> Instant Reservation
                        </span>
                    </div>

                    <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">{restaurant.name}</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">{restaurant.description}</p>

                    {/* Map Section */}
                    {hasMap && (
                        <div className="mb-10">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-orange-500"/> Location
                            </h3>
                            <div className="rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 h-72">
                                <MapContainer
                                    center={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    className="h-full w-full z-0"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]}>
                                        <Popup>
                                            <strong>{restaurant.name}</strong><br/>
                                            {restaurant.address || ''}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reservation Card */}
                <div className="relative">
                    <div className="sticky top-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 rounded-[3.5rem] shadow-2xl shadow-orange-100/50 dark:shadow-none">
                        {!showGuestForm ? (
                            <>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                                    <Utensils className="text-orange-500"/> Reserve Table
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2">Date</label>
                                        <input type="date" min={today} value={date} onChange={(e)=>setDate(e.target.value)} className="w-full bg-transparent font-bold text-gray-900 dark:text-white outline-none cursor-pointer dark:[color-scheme:dark]" />
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2">Time</label>
                                        <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="w-full bg-transparent font-bold text-gray-900 dark:text-white outline-none cursor-pointer dark:[color-scheme:dark]" />
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">Party Size</label>
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={()=>setGuests(Math.max(1, guests-1))} className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 font-black text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">-</button>
                                            <span className="font-black text-xl w-6 text-center text-gray-900 dark:text-white">{guests}</span>
                                            <button type="button" onClick={()=>setGuests(Math.min(restaurant.max_guests_per_slot || 20, guests+1))} className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 font-black text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">+</button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleReserve}
                                    disabled={!date || !time}
                                    className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:shadow-none transition-all active:scale-95"
                                >
                                    Confirm Reservation
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Guest Details</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">Complete your reservation at {restaurant.name}</p>

                                <form onSubmit={handleSubmitBooking} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none transition-all" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none transition-all" placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                        <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none transition-all" placeholder="+91 98765 43210" />
                                    </div>

                                    <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-2xl border border-orange-100 dark:border-orange-900 text-sm">
                                        <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300 mb-1"><span>Date:</span><span>{date}</span></div>
                                        <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300 mb-1"><span>Time:</span><span>{time}</span></div>
                                        <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300"><span>Guests:</span><span>{guests}</span></div>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 disabled:bg-gray-400 transition-all flex justify-center items-center gap-2 text-lg">
                                        {isSubmitting ? 'Reserving...' : 'Complete Reservation'} <ShieldCheck size={20} />
                                    </button>
                                    <button type="button" onClick={() => setShowGuestForm(false)} className="w-full py-3 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
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
