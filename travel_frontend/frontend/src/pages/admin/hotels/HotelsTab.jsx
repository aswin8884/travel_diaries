import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔥 Added useNavigate
import { Trash2, PenTool, MapPin, Star, Eye } from 'lucide-react';
import axios from 'axios';

const HotelsTab = ({ destinations }) => {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate(); // 🔥 Hook for routing

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/hotels/');
                setHotels(res.data.results || res.data);
            } catch (error) { console.error(error); }
        };
        fetchHotels();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    const getDestName = (id) => destinations.find(d => d.id === id)?.name || 'Unknown';

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this hotel permanently?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/hotels/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
            setHotels(hotels.filter(h => h.id !== id));
        } catch (error) { alert("Failed to delete hotel."); }
    };

    if (hotels.length === 0) return <p className="text-center text-gray-500 py-12 bg-white/50 rounded-3xl">No hotels found. Add one from the Command Center!</p>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels.map(hotel => (
                    <div key={hotel.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group relative hover:-translate-y-1">
                        
                        {/* Hover Action Buttons */}
                        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                                onClick={() => navigate(`/admin/edit-hotel/${hotel.id}`)} 
                                className="p-2 bg-white/90 backdrop-blur-md text-gray-800 hover:bg-blue-600 hover:text-white rounded-lg shadow-sm"
                            >
                                <PenTool size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(hotel.id)} 
                                className="p-2 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-lg shadow-sm"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button 
                                onClick={() => navigate(`/admin/hotels/${hotel.id}`)} 
                                className="p-2 bg-white/90 backdrop-blur-md text-gray-800 hover:bg-green-500 hover:text-white rounded-lg shadow-sm"
                            >
                                <Eye size={16} />
                            </button>
                        </div>
                        
                        {/* Image & Destination Tag */}
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                            <img src={getImageUrl(hotel.image)} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                                <MapPin size={12} className="text-blue-500"/> {getDestName(hotel.destination)}
                            </div>
                        </div>
                        
                        {/* Details */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{hotel.name}</h3>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-1.5 py-0.5 rounded text-xs">
                                    <Star size={12} fill="currentColor" /> {hotel.rating}
                                </div>
                            </div>
                            <p className="text-lg font-black text-gray-900 mt-2">
                                ₹{hotel.price_per_night} <span className="text-xs text-gray-400 font-medium">/ night</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelsTab;