import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Utensils } from 'lucide-react';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

const DiningTab = ({ restaurants }) => {
    if (!restaurants || restaurants.length === 0) {
        return <div className="text-center p-10 text-gray-400 font-bold">No dining options available here yet.</div>;
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {restaurants.map(restaurant => (
                <div key={restaurant.id} className="flex gap-4 p-4 border border-gray-100 rounded-[2rem] hover:shadow-lg transition-all bg-white">
                    <img src={getImageUrl(restaurant.image)} alt={restaurant.name} className="w-32 h-32 object-cover rounded-3xl" />
                    
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-xl font-black text-gray-900">{restaurant.name}</h4>
                                <span className="flex items-center gap-1 text-xs font-bold text-orange-500">
                                    <Clock size={12}/> {restaurant.opening_time.slice(0,5)} - {restaurant.closing_time.slice(0,5)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="block text-lg font-black text-gray-900">₹{restaurant.average_cost}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">/ person</span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{restaurant.short_description || restaurant.description}</p>
                        
                        {/* 🔥 THIS LINKS TO YOUR FULL SCREEN RESTAURANT PAGE */}
                        <Link to={`/restaurant/${restaurant.id}`} className="inline-flex items-center justify-center gap-2 bg-orange-50 text-orange-600 font-bold py-2 px-4 rounded-xl hover:bg-orange-600 hover:text-white transition-colors w-fit text-sm">
                            <Utensils size={16} /> Reserve Table
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DiningTab;