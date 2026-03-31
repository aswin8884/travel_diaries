import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BedDouble } from 'lucide-react';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

const StaysTab = ({ hotels }) => {
    if (!hotels || hotels.length === 0) {
        return <div className="text-center p-10 text-gray-400 font-bold">No stays available for this destination yet.</div>;
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {hotels.map(hotel => (
                <div key={hotel.id} className="flex gap-4 p-4 border border-gray-100 rounded-[2rem] hover:shadow-lg transition-all bg-white">
                    <img src={getImageUrl(hotel.image)} alt={hotel.name} className="w-32 h-32 object-cover rounded-3xl" />
                    
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-xl font-black text-gray-900">{hotel.name}</h4>
                                <span className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                    <Star size={12} fill="currentColor"/> {hotel.rating}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="block text-lg font-black text-gray-900">₹{hotel.price_per_night}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">/ night</span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{hotel.short_description || hotel.description}</p>
                        
                        {/* 🔥 THIS LINKS TO YOUR FULL SCREEN HOTEL PAGE */}
                        <Link to={`/hotel/${hotel.id}`} className="inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-bold py-2 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition-colors w-fit text-sm">
                            <BedDouble size={16} /> View & Book
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StaysTab;