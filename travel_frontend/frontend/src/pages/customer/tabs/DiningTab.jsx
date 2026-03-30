import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Utensils } from 'lucide-react';

const DiningTab = ({ restaurants, getImageUrl, onClose }) => {
    const navigate = useNavigate();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

const handleBooking = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            onClose();
            navigate('/login');
            return;
        }
        onClose();
        navigate('/checkout', { 
            state: { 
                type: 'restaurant', 
                item: selectedRestaurant, 
                total: selectedRestaurant.price 
            } 
        });
    };

    if (selectedRestaurant) {
        return (
            <div className="animate-in slide-in-from-right-8 fade-in">
                <button onClick={() => setSelectedRestaurant(null)} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 font-bold bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 transition-all hover:-translate-x-1"><ArrowLeft size={18}/> Back to all Dining</button>
                <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 flex flex-col p-4 gap-4 bg-gray-50/50">
                        <div className="w-full h-[30vh] lg:h-[40vh] relative rounded-3xl overflow-hidden shadow-sm">
                            <img src={getImageUrl(selectedRestaurant.image)} alt={selectedRestaurant.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        {selectedRestaurant.gallery?.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {selectedRestaurant.gallery.map(img => (
                                    <div key={img.id} className="h-24 relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                        <img src={getImageUrl(img.image)} className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="flex items-center gap-2 text-yellow-500 font-black bg-yellow-50 px-3.5 py-1.5 rounded-lg w-max mb-4 shadow-sm border border-yellow-100"><Star size={16} fill="currentColor"/> {selectedRestaurant.rating} Star Culinary Experience</div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">{selectedRestaurant.name}</h2>
                        <div className="flex-grow overflow-y-auto hide-scrollbar max-h-[30vh] mb-8 pr-4">
                            <p className="text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-line">{selectedRestaurant.description}</p>
                        </div>
                        <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-orange-50/50 rounded-3xl border border-orange-100">
                            <div>
                                <p className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-1">Average Cost</p>
                                <p className="text-3xl font-black text-gray-900">₹{selectedRestaurant.price} <span className="text-lg text-gray-500 font-bold">/ person</span></p>
                            </div>
                            <button onClick={handleBooking} className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"><Utensils size={20}/> Reserve Table</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (restaurants.length === 0) return <p className="text-gray-500 font-medium py-12 bg-white rounded-3xl text-center shadow-sm">No dining spots listed.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
            {restaurants.map(rest => (
                <div key={rest.id} onClick={() => setSelectedRestaurant(rest)} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 overflow-hidden group">
                    <div className="h-56 bg-gray-100 relative overflow-hidden">
                        <img src={getImageUrl(rest.image)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-sm"><Star size={14} className="text-yellow-500" fill="currentColor"/> {rest.rating}</div>
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{rest.name}</h3>
                        <p className="text-gray-500 text-base line-clamp-2 mb-6 font-medium">{rest.description}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-4">
                            <div><span className="text-sm font-bold text-gray-400">Avg: </span><span className="text-2xl font-black text-gray-900">₹{rest.price}</span></div>
                            <div className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold group-hover:bg-orange-500 transition-colors">View Details</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DiningTab;