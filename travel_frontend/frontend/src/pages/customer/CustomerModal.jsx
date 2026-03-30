import { useState, useEffect } from 'react';
import { X, MapPin, AlignLeft, Building, Utensils } from 'lucide-react';
import axios from 'axios';

// 🔥 Import our brand new sub-components
import OverviewTab from './tabs/OverviewTab';
import StaysTab from './tabs/StaysTab';
import DiningTab from './tabs/DiningTab';

const CustomerModal = ({ dest, isActive, onClose, getImageUrl }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [hotels, setHotels] = useState([]);
    const [restaurants, setRestaurants] = useState([]);

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

    // Reset to overview when closing
    const handleClose = () => {
        setActiveTab('overview');
        onClose();
    };

    if (!dest) return null;

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-6 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`w-full max-w-[95vw] xl:max-w-[1300px] h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={e => e.stopPropagation()}>
                
                <button onClick={handleClose} className="absolute top-6 right-6 z-[250] p-3 bg-white/90 backdrop-blur-md hover:bg-gray-100 text-gray-800 rounded-full shadow-lg border border-gray-200 transition-transform hover:scale-110"><X size={20} strokeWidth={2.5} /></button>

                <div className="overflow-y-auto w-full h-full z-10 relative hide-scrollbar pb-32">
                    
                    {/* Dynamic Hero Image */}
                    <div className={`w-full relative bg-gray-100 transition-all duration-500 h-[30vh] md:h-[40vh]`}>
                        <img src={getImageUrl(dest.image)} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 -mt-20">
                        
                        {/* Title Header */}
                        <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] shadow-xl border border-white mb-8">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4"><MapPin size={15} /> Destination</div>
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">{dest.name}</h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-4xl">{dest.short_description}</p>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 bg-gray-50 p-2 rounded-2xl border border-gray-100 inline-flex w-full md:w-auto shadow-sm">
                            <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}><AlignLeft size={18}/> Overview & Map</button>
                            <button onClick={() => setActiveTab('stays')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'stays' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}><Building size={18}/> Stays ({hotels.length})</button>
                            <button onClick={() => setActiveTab('dining')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'dining' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}><Utensils size={18}/> Dining ({restaurants.length})</button>
                        </div>

                        {activeTab === 'overview' && <OverviewTab dest={dest} getImageUrl={getImageUrl} />}
                        {activeTab === 'stays' && <StaysTab hotels={hotels} getImageUrl={getImageUrl} onClose={handleClose} />}
                        {activeTab === 'dining' && <DiningTab restaurants={restaurants} getImageUrl={getImageUrl} onClose={handleClose} />}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;