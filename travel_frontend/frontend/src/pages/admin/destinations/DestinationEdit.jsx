import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, AlignLeft, UploadCloud, Images, Save, Star } from 'lucide-react';

const DestinationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [editForm, setEditForm] = useState({
        name: '',
        short_description: '',
        long_description: '',
        latitude: '',
        longitude: '',
        rating: '' // 🔥 Added Rating
    });
    
    const [newImage, setNewImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [newGallery, setNewGallery] = useState([]);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/destinations/${id}/`);
                const dest = res.data;
                setEditForm({
                    name: dest.name || '',
                    short_description: dest.short_description || '',
                    long_description: dest.long_description || '',
                    latitude: dest.latitude || '',
                    longitude: dest.longitude || '',
                    rating: dest.rating || '' // 🔥 Pre-fill Rating
                });
                setPreview(dest.image);
            } catch (error) {
                console.error("Failed to fetch destination:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('short_description', editForm.short_description);
        formData.append('long_description', editForm.long_description);
        formData.append('latitude', editForm.latitude);
        formData.append('longitude', editForm.longitude);
        formData.append('rating', editForm.rating); // 🔥 Append Rating
        
        if (newImage) formData.append('image', newImage);
        newGallery.forEach(file => {
            formData.append('gallery_images', file);
        });

        try {
            const token = localStorage.getItem('access_token');
            await axios.patch(`http://localhost:8000/api/destinations/${id}/`, formData, { 
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'multipart/form-data' 
                } 
            });
            alert("Destination updated!");
            navigate('/admin');
        } catch (error) { 
            console.error(error);
            alert("Failed to update destination."); 
        } finally { 
            setIsSaving(false); 
        }
    };

    if (isLoading) return <div className="p-20 text-center font-bold text-gray-400">Loading editor...</div>;

    return (
        <div className="min-h-screen bg-gray-50/30 pb-20 pt-10 px-6">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    
                    <button onClick={() => navigate('/admin')} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-8 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        <ArrowLeft size={16} /> Cancel Editing
                    </button>
                    
                    <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <MapPin className="text-indigo-600" size={32}/> Edit Destination
                    </h2>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Destination Name</label>
                                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 focus:ring-2" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Short Tagline</label>
                                <input type="text" required value={editForm.short_description} onChange={(e) => setEditForm({...editForm, short_description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 focus:ring-2" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><AlignLeft size={16}/> Full Description</label>
                                <textarea required rows="4" value={editForm.long_description} onChange={(e) => setEditForm({...editForm, long_description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 resize-none"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} className="text-indigo-500"/> Latitude</label>
                                <input type="number" step="any" required value={editForm.latitude} onChange={(e) => setEditForm({...editForm, latitude: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 focus:ring-2" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} className="text-indigo-500"/> Longitude</label>
                                <input type="number" step="any" required value={editForm.longitude} onChange={(e) => setEditForm({...editForm, longitude: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 focus:ring-2" />
                            </div>

                            {/* 🔥 ADDED RATING FIELD */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Star size={16} className="text-yellow-500" /> Star Rating (1.0 - 5.0)
                                </label>
                                <input type="number" step="0.1" min="1" max="5" required value={editForm.rating} onChange={(e) => setEditForm({...editForm, rating: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-lg" />
                            </div>

                            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><UploadCloud size={16}/> Replace Main Image</label>
                                <input type="file" accept="image/*" onChange={(e) => { setNewImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-bold file:bg-white file:text-indigo-700 cursor-pointer" />
                                {preview && <img src={preview} alt="Preview" className="mt-3 h-24 rounded-lg object-cover shadow-sm" />}
                            </div>

                            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Images size={16}/> Replace Entire Gallery</label>
                                <input type="file" multiple accept="image/*" onChange={(e) => setNewGallery(Array.from(e.target.files))} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-bold file:bg-white file:text-indigo-700 cursor-pointer" />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-xl">
                                {isSaving ? 'Saving...' : <><Save size={24} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DestinationEdit;