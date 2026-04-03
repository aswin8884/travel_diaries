import { useState, useEffect } from 'react';
import { X, MapPin, AlignLeft, Building, Utensils, Heart } from 'lucide-react';
import axios from 'axios';

import OverviewTab from './tabs/OverviewTab';
import StaysTab from "./tabs/StaysTab";
import DiningTab from "./tabs/DiningTab";

const CustomerModal = ({ dest, isActive, onClose, getImageUrl, onToggleLike, likingId }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [hotels, setHotels] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const isLoggedIn = !!localStorage.getItem('access_token');

    useEffect(() => {
        if (!dest) return;
        const fetchBookings = async () => {
            try {
                const [hotelRes, restRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/hotels/'),
                    axios.get('http://localhost:8000/api/restaurants/')
                ]);
                setHotels((hotelRes.data.results || hotelRes.data).filter(h => h.destination === dest.id));
                setRestaurants((restRes.data.results || restRes.data).filter(r => r.destination === dest.id));
            } catch (error) { console.error(error); }
        };
        fetchBookings();
    }, [dest]);

    const handleClose = () => {
        setActiveTab('overview');
        onClose();
    };

    if (!dest) return null;

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-6 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
        >
            <div
                className={`w-full max-w-[95vw] xl:max-w-[1300px] h-[95vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-[250] p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-transform hover:scale-110"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                <div className="overflow-y-auto w-full h-full z-10 relative hide-scrollbar pb-32">

                    {/* Hero Image */}
                    <div className="w-full relative bg-gray-100 dark:bg-gray-800 transition-all duration-500 h-[30vh] md:h-[40vh]">
                        <img src={getImageUrl(dest.image)} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/40 dark:via-gray-900/40 to-transparent"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 -mt-20">

                        {/* Title Header */}
                        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] shadow-xl border border-white dark:border-gray-800 mb-8">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-900">
                                <MapPin size={15} /> Destination
                            </div>
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{dest.name}</h2>
                                {onToggleLike && (
                                    <button
                                        onClick={(e) => onToggleLike(e, dest.id)}
                                        disabled={likingId === dest.id}
                                        title={dest.is_liked_by_me ? 'Unlike' : 'Like this destination'}
                                        className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all duration-200 active:scale-90 border
                                            ${dest.is_liked_by_me
                                                ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200 dark:shadow-rose-900/40'
                                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                                            }`}
                                    >
                                        <Heart size={18} fill={dest.is_liked_by_me ? 'currentColor' : 'none'} />
                                        <span>{dest.likes_count ?? 0}</span>
                                    </button>
                                )}
                            </div>
                            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-4xl">{dest.short_description}</p>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 w-full shadow-sm">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <AlignLeft size={18}/> Overview & Map
                            </button>
                            <button
                                onClick={() => setActiveTab('stays')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'stays' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <Building size={18}/> Stays ({hotels.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('dining')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'dining' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <Utensils size={18}/> Dining ({restaurants.length})
                            </button>
                        </div>

                        {activeTab === 'overview' && <OverviewTab dest={dest} getImageUrl={getImageUrl} />}
                        {activeTab === 'stays' && <StaysTab hotels={hotels} isLoggedIn={isLoggedIn} />}
                        {activeTab === 'dining' && <DiningTab restaurants={restaurants} isLoggedIn={isLoggedIn} />}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;
