import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, PenTool, Eye, Heart } from 'lucide-react';
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
        axios.get('http://localhost:8000/api/destinations/')
            .then(res => setDestinations(res.data.results || res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this destination permanently?')) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/destinations/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDestinations(prev => prev.filter(d => d.id !== id));
        } catch {
            alert('Failed to delete destination.');
        }
    };

    if (destinations.length === 0) return (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
            No destinations found. Add one from the Command Center!
        </p>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {destinations.map(dest => (
                    <div key={dest.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all group relative hover:-translate-y-1">

                        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                                onClick={() => navigate(`/admin/destinations/${dest.id}`)}
                                className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-800 dark:text-gray-200 hover:bg-indigo-600 hover:text-white rounded-lg shadow-sm transition-colors"
                            >
                                <Eye size={16} />
                            </button>
                            <button
                                onClick={() => navigate(`/admin/edit-destination/${dest.id}`)}
                                className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white rounded-lg shadow-sm transition-colors"
                            >
                                <PenTool size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(dest.id)}
                                className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-lg shadow-sm transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                            <img
                                src={getImageUrl(dest.image)}
                                alt={dest.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-2">{dest.name}</h3>
                                <div className="flex items-center gap-1 text-rose-500 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded-lg text-xs border border-rose-100 dark:border-rose-900 shrink-0">
                                    <Heart size={12} fill="currentColor"/> {dest.likes_count ?? 0}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2">{dest.short_description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DestinationsTab;
