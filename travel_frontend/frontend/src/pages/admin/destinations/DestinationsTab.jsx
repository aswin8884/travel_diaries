import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, PenTool, Eye, Star } from 'lucide-react'; // 🔥 Imported Star
import axios from 'axios';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

const DestinationsTab = () => {
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/destinations/');
                setDestinations(res.data.results || res.data);
            } catch (error) { console.error(error); }
        };
        fetchDestinations();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this destination permanently?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/destinations/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
            setDestinations(destinations.filter(d => d.id !== id));
        } catch (error) { alert("Failed to delete destination."); }
    };

    if (destinations.length === 0) return <p className="text-center text-gray-500 py-12 bg-white/50 rounded-3xl">No destinations found. Add one from the Command Center!</p>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {destinations.map(dest => (
                    <div key={dest.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group relative hover:-translate-y-1">
                        
                        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => navigate(`/admin/destinations/${dest.id}`)} className="p-2 bg-white/90 backdrop-blur-md text-gray-800 hover:bg-indigo-600 hover:text-white rounded-lg shadow-sm">
                                <Eye size={16} />
                            </button>
                            <button onClick={() => navigate(`/admin/edit-destination/${dest.id}`)} className="p-2 bg-white/90 backdrop-blur-md text-gray-800 hover:bg-blue-600 hover:text-white rounded-lg shadow-sm">
                                <PenTool size={16} />
                            </button>
                            <button onClick={() => handleDelete(dest.id)} className="p-2 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-lg shadow-sm">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                            <img src={getImageUrl(dest.image)} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{dest.name}</h3>
                                {/* 🔥 ADDED RATING BADGE */}
                                <div className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded-lg text-xs border border-yellow-100/50">
                                    <Star size={12} fill="currentColor" /> {dest.rating || "0.0"}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-500 line-clamp-2">{dest.short_description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DestinationsTab;