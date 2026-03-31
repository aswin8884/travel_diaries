import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, Building, MapPin, AlignLeft, Star, ArrowLeft, Save, Images, Hash, BedDouble, PenTool } from 'lucide-react';
import axios from 'axios';

// Accept initialData (for editing), and callbacks for cancel/success
const HotelForm = ({ initialData = null, onCancel, onSuccess }) => {
    const navigate = useNavigate();
    const isEditMode = Boolean(initialData);
    
    const [destinations, setDestinations] = useState([]);
    
    // Initialize states with initialData if it exists, otherwise use empty strings
    const [selectedDestination, setSelectedDestination] = useState(initialData?.destination || '');
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price_per_night || '');
    const [rating, setRating] = useState(initialData?.rating || '');
    const [totalRooms, setTotalRooms] = useState(initialData?.total_rooms || ''); 
    const [latitude, setLatitude] = useState(initialData?.latitude || '');
    const [longitude, setLongitude] = useState(initialData?.longitude || '');
    
    const [image, setImage] = useState(null); 
    // If editing, show the existing image URL as the initial preview
    const [preview, setPreview] = useState(initialData?.image || null);
    
    const [gallery, setGallery] = useState([]);
    
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/destinations/');
                setDestinations(res.data.results || res.data);
            } catch (error) { console.error("Failed to fetch destinations"); }
        };
        fetchDestinations();
    }, []);

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
    };

    const handleGalleryChange = (e) => {
        setGallery(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('destination', selectedDestination);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price_per_night', price);
        formData.append('rating', rating);
        formData.append('total_rooms', totalRooms);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        
        // Only append the image if a NEW one was selected
        if (image) formData.append('image', image);
        gallery.forEach(file => formData.append('gallery_images', file));

        try {
            const token = localStorage.getItem('access_token');
            
            // 🔥 Dynamic API Call: PATCH if editing, POST if adding
            const url = isEditMode 
                ? `http://localhost:8000/api/hotels/${initialData.id}/` 
                : 'http://localhost:8000/api/hotels/';
            const method = isEditMode ? 'patch' : 'post';

            const res = await axios[method](url, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });
            
            if (onSuccess) {
                onSuccess(res.data);
            } else {
                alert(`Hotel successfully ${isEditMode ? 'updated' : 'added'}!`);
                navigate('/admin'); 
            }
        } catch (error) {
            setErrorMessage(`Failed to ${isEditMode ? 'update' : 'add'} hotel. Ensure backend is migrated.`);
        } finally {
            setIsSaving(false);
        }
    };

    // Use passed onCancel if available, otherwise navigate back
    const handleCancel = () => {
        if (onCancel) onCancel();
        else navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50/30 pb-20 pt-10 px-6">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                    
                    <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 mb-8 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        <ArrowLeft size={16} /> {isEditMode ? 'Cancel Editing' : 'Back to Command Center'}
                    </button>
                    
                    <div className="mb-10 pb-6 border-b border-gray-100">
                        <h2 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                            {isEditMode ? <PenTool className="text-blue-600" size={32}/> : <Building className="text-blue-600" size={32}/>}
                            {isEditMode ? 'Edit Hotel Profile' : 'Add New Hotel'}
                        </h2>
                    </div>

                    {errorMessage && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-8">
                            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={18} className="text-blue-500"/> Select Destination</label>
                            <select required value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 shadow-sm cursor-pointer">
                                <option value="" disabled>-- Choose the city --</option>
                                {destinations.map(dest => <option key={dest.id} value={dest.id}>{dest.name}</option> )}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Hotel Name</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" placeholder="e.g., Taj Mahal Palace" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><AlignLeft size={16}/> Description</label>
                                <textarea required rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg resize-none"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} className="text-blue-500"/> Latitude</label>
                                <input type="number" step="any" required value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" placeholder="41.8902" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} className="text-blue-500"/> Longitude</label>
                                <input type="number" step="any" required value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" placeholder="12.4922" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><span className="text-xl font-black text-blue-600">₹</span> Price per Night (₹)</label>
                                <input type="number" step="any" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" placeholder="12500" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Star size={16}/> Star Rating (1.0 - 5.0)</label>
                                <input type="number" step="0.1" min="1" max="5" required value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" placeholder="4.9" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><BedDouble size={16} className="text-blue-500"/> Total Rooms</label>
                                <input type="number" required value={totalRooms} onChange={(e) => setTotalRooms(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" placeholder="10" />
                            </div>

                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><UploadCloud size={16}/> {isEditMode ? 'Replace Main Cover Image' : 'Main Cover Image'}</label>
                                <input type="file" required={!isEditMode} onChange={handleMainImageChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer w-full" />
                                {preview && <img src={preview} alt="Preview" className="mt-3 h-24 rounded-lg object-cover shadow-sm" />}
                                {isEditMode && !image && <p className="text-xs text-gray-500 mt-2">Leave blank to keep current image.</p>}
                            </div>

                            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Images size={16} className="text-blue-500"/> {isEditMode ? 'Replace Room Gallery' : 'Room Gallery'}</label>
                                <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full border border-blue-100 shadow-sm" />
                                {gallery.length > 0 && <p className="text-xs text-blue-600 font-bold mt-2">{gallery.length} new files selected.</p>}
                                {isEditMode && <p className="text-xs text-gray-500 mt-2">Selecting files will overwrite the old gallery.</p>}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-xl">
                                {isSaving ? 'Saving to Database...' : <><Save size={24} /> {isEditMode ? 'Save Changes' : 'Publish Hotel'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HotelForm;