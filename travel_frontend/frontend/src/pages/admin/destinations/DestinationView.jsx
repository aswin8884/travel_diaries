import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, AlignLeft, Star, ArrowLeft, PenTool, Trash2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet marker fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const DestinationView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dest, setDest] = useState(null);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/destinations/${id}/`);
                setDest(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDestination();
    }, [id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this destination?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/destinations/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Destination deleted successfully.");
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert("Failed to delete destination.");
        }
    };

    if (!dest) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 animate-pulse">Loading...</div>;

    const hasCoordinates = dest.latitude && dest.longitude;

    // 🔥 THE FIX: Bulletproof check for gallery images regardless of what Django names them.
    const galleryList = dest.gallery_images || dest.images || dest.gallery || [];

    return (
        <div className="pb-40 bg-white">
            
            {/* 1. HUGE MAIN HERO IMAGE */}
            <div className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden">
                <Link to="/admin" className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                    <Link to={`/admin/edit-destination/${dest.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-white bg-indigo-600/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                        <PenTool size={16} /> Edit
                    </Link>
                    <button onClick={handleDelete} className="inline-flex items-center gap-2 text-sm font-bold text-white bg-red-500/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
                
                <img src={getImageUrl(dest.image)} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-4">
                
                {/* 2. HEADER INFORMATION */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest shadow-sm border border-indigo-100">
                            <MapPin size={15} /> Destination
                        </div>
                        
                        <div className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-xs font-black uppercase tracking-widest shadow-sm border border-yellow-100">
                            <Star size={15} fill="currentColor" /> {dest.rating || '0.0'} Rating
                        </div>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">{dest.name}</h2>
                    <p className="text-xl font-medium text-gray-600 leading-tight max-w-4xl">{dest.short_description}</p>
                </div>

                {/* 3. MULTIPLE SUB IMAGES (Using the bulletproof galleryList) */}
                {galleryList.length > 0 && (
                    <div className="mb-16">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ImageIcon size={16} className="text-indigo-400"/> Gallery
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {galleryList.map((img, idx) => (
                                <div key={img.id || idx} className="h-40 md:h-48 relative rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group">
                                    <img src={getImageUrl(img.image)} alt={`Gallery Image ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* 4. DETAILS AND MAP */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6 border-t border-gray-100">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="max-w-5xl">
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <AlignLeft size={18} className="text-indigo-500"/> The Details
                            </h4>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg font-medium">
                                {dest.long_description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><MapPin className="text-indigo-500"/> Location Map</h3>
                            {hasCoordinates ? (
                                <div className="h-64 w-full rounded-[1.5rem] overflow-hidden shadow-inner border border-gray-200 z-0 relative">
                                    <MapContainer center={[dest.latitude, dest.longitude]} zoom={12} scrollWheelZoom={false} className="h-full w-full z-0">
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                        <Marker position={[dest.latitude, dest.longitude]}>
                                            <Popup className="font-bold">{dest.name}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            ) : (
                                <div className="h-64 bg-white rounded-[1.5rem] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold px-6 text-center shadow-sm">
                                    No coordinates provided.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DestinationView;