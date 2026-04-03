import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, BedDouble, ChevronLeft, ChevronRight, AlertCircle, MapPin } from 'lucide-react';
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

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [rooms, setRooms] = useState(1);
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

    if (!hotel) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-gray-400 dark:text-gray-500 animate-pulse">Loading Premium Stay...</p>
            </div>
        </div>
    );

    const today = new Date().toISOString().split('T')[0];
    const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 1;
    const availableRooms = hotel.available_rooms ?? hotel.total_rooms;
    const isFullyBooked = availableRooms === 0;
    const hasMap = hotel.latitude && hotel.longitude;

    const allImages = [hotel.image, ...(hotel.gallery_images?.map(g => g.image) || hotel.images?.map(g => g.image) || [])];
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    const handleProceedToCheckout = () => {
        if (isFullyBooked) return;
        const totalPrice = hotel.price_per_night * nights * rooms;
        const advancePrice = Math.round(totalPrice * 0.5);
        navigate(`/checkout/hotel/${hotel.id}`, {
            state: {
                hotelId: hotel.id,
                hotelName: hotel.name,
                hotelImage: getImageUrl(hotel.image),
                checkIn,
                checkOut,
                rooms,
                nights,
                totalPrice,
                advancePrice,
            }
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
            <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Info & Gallery */}
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[450px] group mb-4 bg-gray-100 dark:bg-gray-800">
                            <img src={getImageUrl(allImages[currentImageIndex])} className="w-full h-full object-cover transition-all duration-500" alt="Hotel View" />

                            {/* Fully Booked Overlay */}
                            {isFullyBooked && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <div className="bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl text-center transform -rotate-6">
                                        <p className="text-3xl font-black uppercase tracking-widest">Fully Booked</p>
                                        <p className="text-sm font-bold mt-1 opacity-80">No rooms available</p>
                                    </div>
                                </div>
                            )}

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
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {allImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${currentImageIndex === idx ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                        <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900 flex items-center gap-1">
                            <BedDouble size={14}/> Premium Stay
                        </span>
                        <span className="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-100 dark:border-yellow-900 flex items-center gap-1">
                            <Star size={14} fill="currentColor"/> {hotel.rating || '0.0'} Rating
                        </span>
                        {isFullyBooked ? (
                            <span className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-red-200 dark:border-red-900 flex items-center gap-1 animate-pulse">
                                <AlertCircle size={14}/> Fully Booked
                            </span>
                        ) : (
                            <span className="bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-100 dark:border-green-900 flex items-center gap-1">
                                {availableRooms} Rooms Available
                            </span>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">{hotel.name}</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">{hotel.description || hotel.short_description}</p>

                    {/* Map Section */}
                    {hasMap && (
                        <div className="mb-10">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-blue-500"/> Location
                            </h3>
                            <div className="rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 h-72">
                                <MapContainer
                                    center={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    className="h-full w-full z-0"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]}>
                                        <Popup>
                                            <strong>{hotel.name}</strong><br/>
                                            {hotel.address || ''}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Booking Card */}
                <div className="relative">
                    <div className={`sticky top-10 bg-white dark:bg-gray-900 border p-8 rounded-[3rem] shadow-2xl transition-all ${isFullyBooked ? 'border-red-200 dark:border-red-900 shadow-red-100/50' : 'border-gray-100 dark:border-gray-800 shadow-blue-100/50'}`}>

                        {isFullyBooked ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="text-red-500 w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Fully Booked</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">All {hotel.total_rooms} rooms are currently occupied.</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Check back later or explore other hotels in this destination.</p>
                                <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-100 dark:border-red-900">
                                    <p className="text-xs font-black text-red-500 uppercase tracking-widest">Rooms at full capacity</p>
                                    <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">0 / {hotel.total_rooms}</p>
                                </div>
                                <button onClick={() => navigate(-1)} className="mt-6 w-full py-4 bg-gray-900 dark:bg-gray-700 text-white font-black rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all">
                                    Explore Other Hotels
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-gray-900 dark:text-white">₹{hotel.price_per_night}</span>
                                        <span className="text-sm font-bold text-gray-400 dark:text-gray-500">/night</span>
                                    </div>
                                    <span className="text-[10px] font-black text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-900 uppercase tracking-wider">
                                        {availableRooms} Left
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors focus-within:border-blue-300 focus-within:bg-blue-50/30">
                                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Check-in</label>
                                            <input type="date" min={today} value={checkIn} onChange={(e)=>setCheckIn(e.target.value)} className="w-full bg-transparent font-bold text-gray-900 dark:text-white outline-none cursor-pointer dark:[color-scheme:dark]" />
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors focus-within:border-blue-300 focus-within:bg-blue-50/30">
                                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Check-out</label>
                                            <input type="date" min={checkIn || today} value={checkOut} onChange={(e)=>setCheckOut(e.target.value)} className="w-full bg-transparent font-bold text-gray-900 dark:text-white outline-none cursor-pointer dark:[color-scheme:dark]" />
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Rooms</label>
                                        <div className="flex items-center gap-4">
                                            <button onClick={()=>setRooms(Math.max(1, rooms-1))} className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 font-black text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">-</button>
                                            <span className="font-black text-xl w-6 text-center text-gray-900 dark:text-white">{rooms}</span>
                                            <button onClick={()=>setRooms(Math.min(availableRooms, rooms+1))} className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 font-black text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">+</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mb-6 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total ({nights} night{nights > 1 ? 's' : ''})</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">₹{hotel.price_per_night * nights * rooms}</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-3 space-y-1.5 text-xs font-bold">
                                        <div className="flex justify-between text-blue-700 dark:text-blue-300">
                                            <span>Pay now (50% advance)</span>
                                            <span>₹{Math.round(hotel.price_per_night * nights * rooms * 0.5)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                            <span>Pay at check-in (50%)</span>
                                            <span>₹{Math.round(hotel.price_per_night * nights * rooms * 0.5)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleProceedToCheckout} disabled={!checkIn || !checkOut} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 dark:shadow-blue-900/50 disabled:from-gray-200 disabled:to-gray-200 dark:disabled:from-gray-700 dark:disabled:to-gray-700 disabled:shadow-none hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                                    Proceed to Checkout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
