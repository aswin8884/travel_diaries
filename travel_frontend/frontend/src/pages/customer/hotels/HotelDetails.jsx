import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, BedDouble, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    
    // Booking State
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [rooms, setRooms] = useState(1);
    
    // Gallery State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/hotels/${id}/`)
            .then(res => setHotel(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    // 🔥 THE LOADING SHIELD: Prevents the white screen crash!
    if (!hotel) return <div className="min-h-screen flex items-center justify-center font-black text-gray-300 animate-pulse">Loading Premium Stay...</div>;

    // DATE VALIDATION LOGIC
    const today = new Date().toISOString().split('T')[0];
    const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 1;

    // GALLERY LOGIC
    const allImages = [hotel.image, ...(hotel.gallery_images?.map(g => g.image) || hotel.images?.map(g => g.image) || [])];
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    // CHECKOUT NAVIGATION LOGIC
    const handleProceedToCheckout = () => {
        navigate(`/checkout/hotel/${hotel.id}`, {
            state: {
                hotelId: hotel.id,
                hotelName: hotel.name,
                hotelImage: getImageUrl(hotel.image),
                checkIn,
                checkOut,
                rooms,
                nights,
                totalPrice: hotel.price_per_night * nights * rooms
            }
        });
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 hover:text-blue-600 transition-all">
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Info & Gallery */}
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[450px] group mb-4 bg-gray-100">
                            <img src={getImageUrl(allImages[currentImageIndex])} className="w-full h-full object-cover transition-all duration-500" alt="Hotel View" />
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
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                                {allImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${currentImageIndex === idx ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                        <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1">
                            <BedDouble size={14}/> Premium Stay
                        </span>
                        <span className="bg-yellow-50 text-yellow-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-100 flex items-center gap-1">
                            <Star size={14} fill="currentColor"/> {hotel.rating || '0.0'} Rating
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">{hotel.name}</h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">{hotel.description || hotel.short_description}</p>
                </div>

                {/* Right: Booking Card */}
                <div className="relative">
                    <div className="sticky top-10 bg-white border border-gray-100 p-8 rounded-[3rem] shadow-2xl shadow-blue-100/50">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-gray-900">₹{hotel.price_per_night}</span>
                                <span className="text-sm font-bold text-gray-400">/night</span>
                            </div>
                            <span className="text-[10px] font-black text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 uppercase tracking-wider">
                                {hotel.total_rooms} Rooms Left
                            </span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors focus-within:border-blue-300 focus-within:bg-blue-50/30">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-in</label>
                                    <input type="date" min={today} value={checkIn} onChange={(e)=>setCheckIn(e.target.value)} className="w-full bg-transparent font-bold text-gray-900 outline-none cursor-pointer" />
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors focus-within:border-blue-300 focus-within:bg-blue-50/30">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-out</label>
                                    <input type="date" min={checkIn || today} value={checkOut} onChange={(e)=>setCheckOut(e.target.value)} className="w-full bg-transparent font-bold text-gray-900 outline-none cursor-pointer" />
                                </div>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Rooms</label>
                                <div className="flex items-center gap-4">
                                    <button onClick={()=>setRooms(Math.max(1, rooms-1))} className="w-10 h-10 rounded-full bg-white border border-gray-200 font-black text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">-</button>
                                    <span className="font-black text-xl w-6 text-center">{rooms}</span>
                                    <button onClick={()=>setRooms(Math.min(hotel.total_rooms, rooms+1))} className="w-10 h-10 rounded-full bg-white border border-gray-200 font-black text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">+</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-6 pt-6 border-t border-gray-100">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total ({nights} night{nights > 1 ? 's' : ''})</p>
                                <p className="text-3xl font-black text-gray-900">₹{hotel.price_per_night * nights * rooms}</p>
                            </div>
                        </div>

                        <button onClick={handleProceedToCheckout} disabled={!checkIn || !checkOut} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-[0.98]">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;