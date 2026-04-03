import { Link, useNavigate } from 'react-router-dom';
import { Star, BedDouble, AlertCircle, Lock } from 'lucide-react';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

const StaysTab = ({ hotels, isLoggedIn }) => {
    const navigate = useNavigate();

    if (!hotels || hotels.length === 0) {
        return (
            <div className="text-center p-10 text-gray-400 dark:text-gray-500 font-bold">
                No stays available for this destination yet.
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {hotels.map(hotel => {
                const availableRooms = hotel.available_rooms ?? hotel.total_rooms;
                const isFullyBooked = availableRooms === 0;

                return (
                    <div
                        key={hotel.id}
                        className={`flex gap-4 p-4 border rounded-[2rem] hover:shadow-lg transition-all bg-white dark:bg-gray-800 relative overflow-hidden ${isFullyBooked ? 'border-red-100 dark:border-red-900 opacity-80' : 'border-gray-100 dark:border-gray-700'}`}
                    >
                        <div className="relative shrink-0">
                            <img src={getImageUrl(hotel.image)} alt={hotel.name} className="w-32 h-32 object-cover rounded-3xl" />
                            {isFullyBooked && (
                                <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
                                    <span className="text-white text-[9px] font-black uppercase tracking-widest text-center leading-tight px-1">Fully<br/>Booked</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white">{hotel.name}</h4>
                                        {isFullyBooked && (
                                            <span className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                                <AlertCircle size={10}/> Full
                                            </span>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                        <Star size={12} fill="currentColor"/>
                                        {hotel.rating || '—'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-black text-gray-900 dark:text-white">₹{hotel.price_per_night}</span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">/ night</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{hotel.short_description || hotel.description}</p>

                            {!isFullyBooked && (
                                <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-3">
                                    {availableRooms} room{availableRooms !== 1 ? 's' : ''} available
                                </p>
                            )}

                            {isFullyBooked ? (
                                <span className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-500 font-bold py-2 px-4 rounded-xl w-fit text-sm cursor-not-allowed">
                                    <AlertCircle size={14}/> Fully Booked
                                </span>
                            ) : isLoggedIn ? (
                                <Link to={`/hotel/${hotel.id}`} className="inline-flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold py-2 px-4 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors w-fit text-sm">
                                    <BedDouble size={16}/> View & Book
                                </Link>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-2 px-4 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors w-fit text-sm"
                                >
                                    <Lock size={14}/> Sign In to Book
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StaysTab;
