import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, BedDouble, PenTool, Trash2, Image as ImageIcon, AlignLeft } from 'lucide-react';
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

const HotelView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/hotels/${id}/`);
                setHotel(res.data);
            } catch (err) { console.error(err); }
        };
        fetchHotel();
    }, [id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this hotel?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/hotels/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
            alert("Hotel deleted successfully.");
            navigate('/admin');
        } catch (error) { alert("Failed to delete hotel."); }
    };

    if (!hotel) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400 animate-pulse text-2xl">Loading Hotel...</div>;

    const hasCoordinates = hotel.latitude && hotel.longitude;
    const allImages = [hotel.image, ...(hotel.gallery_images?.map(g => g.image) || hotel.images?.map(g => g.image) || [])];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10 px-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Top Navigation */}
                <div className="flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm hover:text-blue-500 hover:shadow-md transition-all">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <Link to={`/admin/edit-hotel/${hotel.id}`} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                            <PenTool size={18}/> Edit Hotel
                        </Link>
                        <button onClick={handleDelete} className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-red-200 hover:bg-red-600 hover:-translate-y-0.5 transition-all">
                            <Trash2 size={18}/> Delete
                        </button>
                    </div>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">{hotel.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 font-bold text-sm">
                            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1.5 rounded-full"><Star size={16} fill="currentColor"/> {hotel.rating} Rating</span>
                            <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full"><BedDouble size={16}/> {hotel.total_rooms} Rooms</span>
                        </div>
                    </div>
                    <div className="md:text-right bg-white p-4 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price Per Night</p>
                        <p className="text-3xl font-black text-blue-600">{hotel.price_per_night}</p>
                    </div>
                </div>

                {/* Image Collage */}
                <div className="rounded-[2rem] overflow-hidden bg-gray-100 shadow-2xl border border-gray-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[50vh] min-h-[400px]">
                        <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
                            <img src={getImageUrl(allImages[0])} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        {allImages.slice(1, 5).map((img, idx) => (
                            <div key={idx} className="relative group cursor-pointer overflow-hidden hidden md:block">
                                <img src={getImageUrl(img)} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100">
                            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="bg-blue-100 p-2 rounded-xl text-blue-500"><AlignLeft size={24}/></span>
                                About This Hotel
                            </h3>
                            <p className="text-slate-600 text-lg leading-relaxed font-medium whitespace-pre-line">{hotel.description}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><MapPin className="text-blue-500"/> Location Map</h3>
                            {hasCoordinates ? (
                                <div className="h-72 w-full rounded-[2rem] overflow-hidden shadow-inner border border-gray-200 z-0 relative">
                                    <MapContainer center={[hotel.latitude, hotel.longitude]} zoom={15} scrollWheelZoom={false} className="h-full w-full z-0">
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                        <Marker position={[hotel.latitude, hotel.longitude]}>
                                            <Popup className="font-bold">{hotel.name}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            ) : (
                                <div className="h-72 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold px-6 text-center">
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

export default HotelView;
