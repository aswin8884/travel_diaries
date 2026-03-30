import { useState, useEffect } from 'react';
import { Trash2, PenTool, X, Save, UploadCloud, MapPin, Utensils, Star, Images } from 'lucide-react';
import axios from 'axios';

const RestaurantsTab = ({ destinations }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [editingRest, setEditingRest] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const [editForm, setEditForm] = useState({});
    const [newImage, setNewImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [newGallery, setNewGallery] = useState([]);

    useEffect(() => {
        const fetchRests = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/restaurants/');
                setRestaurants(res.data.results || res.data);
            } catch (error) { console.error(error); }
        };
        fetchRests();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    const getDestName = (id) => destinations.find(d => d.id === id)?.name || 'Unknown';

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this restaurant permanently?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/restaurants/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
            setRestaurants(restaurants.filter(r => r.id !== id));
        } catch (error) { alert("Failed to delete restaurant."); }
    };

    const openEditModal = (rest) => {
        setEditingRest(rest);
        setEditForm({
            name: rest.name,
            description: rest.description,
            price: rest.price,
            rating: rest.rating,
            destination: rest.destination
        });
        setNewImage(null);
        setPreview(null);
        setNewGallery([]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('description', editForm.description);
        formData.append('price', editForm.price);
        formData.append('rating', editForm.rating);
        formData.append('destination', editForm.destination);
        
        if (newImage) formData.append('image', newImage);
        
        newGallery.forEach(file => {
            formData.append('gallery', file);
        });

        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.patch(`http://localhost:8000/api/restaurants/${editingRest.id}/`, formData, { 
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } 
            });
            setRestaurants(restaurants.map(r => r.id === editingRest.id ? res.data : r));
            setEditingRest(null);
        } catch (error) { alert("Failed to update restaurant."); } 
        finally { setIsSaving(false); }
    };

    if (restaurants.length === 0) return <p className="text-center text-gray-500 py-12 bg-white/50 rounded-3xl">No dining spots found. Add one!</p>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurants.map(rest => (
                    <div key={rest.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group relative hover:-translate-y-1">
                        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => openEditModal(rest)} className="p-2 bg-white/90 backdrop-blur-md text-gray-800 hover:bg-orange-500 hover:text-white rounded-lg shadow-sm"><PenTool size={16} /></button>
                            <button onClick={() => handleDelete(rest.id)} className="p-2 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-lg shadow-sm"><Trash2 size={16} /></button>
                        </div>
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                            <img src={getImageUrl(rest.image)} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                                <MapPin size={12} className="text-orange-500"/> {getDestName(rest.destination)}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{rest.name}</h3>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-1.5 py-0.5 rounded text-xs"><Star size={12} fill="currentColor" /> {rest.rating}</div>
                            </div>
                            <p className="text-lg font-black text-gray-900 mt-2">₹{rest.price} <span className="text-xs text-gray-400 font-medium">avg cost</span></p>
                        </div>
                    </div>
                ))}
            </div>
            {editingRest && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6 animate-in fade-in" onClick={() => setEditingRest(null)}>
                    
                    <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl p-10 relative max-h-[95vh] overflow-y-auto hide-scrollbar" onClick={e => e.stopPropagation()}>
                        
                        <button onClick={() => setEditingRest(null)} className="absolute top-6 right-6 p-3 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors border border-gray-100"><X size={20} strokeWidth={2.5}/></button>
                        
                        <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3"><PenTool className="text-orange-500"/> Edit Restaurant Profile</h2>
                        
                        <form onSubmit={handleUpdate} className="space-y-6">
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Restaurant Name</label>
                                <input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
                                    <select value={editForm.destination} onChange={e => setEditForm({...editForm, destination: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-bold text-gray-800">
                                        {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Avg Cost (₹)</label>
                                    <input type="number" step="1" required value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Star Rating</label>
                                    <input type="number" step="0.1" max="5" required value={editForm.rating} onChange={e => setEditForm({...editForm, rating: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Cuisine & Description</label>
                                <textarea rows="6" required value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg resize-none"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><UploadCloud size={16} className="text-orange-500"/> Replace Main Image</label>
                                    <input type="file" accept="image/*" onChange={(e) => { setNewImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white file:text-orange-600 hover:file:bg-orange-100 cursor-pointer w-full border border-orange-100 shadow-sm" />
                                    {preview && <img src={preview} alt="New Preview" className="mt-3 h-24 rounded-lg object-cover shadow-sm" />}
                                </div>
                                
                                <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Images size={16} className="text-orange-500"/> Replace Entire Gallery</label>
                                    <input type="file" multiple accept="image/*" onChange={(e) => setNewGallery(Array.from(e.target.files))} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white file:text-orange-600 hover:file:bg-orange-100 cursor-pointer w-full border border-orange-100 shadow-sm" />
                                    <p className="text-xs text-gray-500 mt-2 font-medium">Select multiple images to overwrite the current gallery.</p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" disabled={isSaving} className="w-full py-4.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-xl">
                                    {isSaving ? 'Saving Changes...' : <><Save size={24} /> Save Restaurant Updates</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default RestaurantsTab;