import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, Utensils, MapPin, AlignLeft, Star, ArrowLeft, Save, Images, Clock, Users, PenTool } from 'lucide-react';
import axios from 'axios';

const RestaurantForm = ({ initialData = null, onCancel, onSuccess }) => {
    const navigate = useNavigate();
    const isEditMode = Boolean(initialData);
    
    const [destinations, setDestinations] = useState([]);
    
    const [selectedDestination, setSelectedDestination] = useState(initialData?.destination || '');
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [averageCost, setAverageCost] = useState(initialData?.average_cost || ''); 
    const [rating, setRating] = useState(initialData?.rating || '');
    const [openingTime, setOpeningTime] = useState(initialData?.opening_time || '09:00');
    const [closingTime, setClosingTime] = useState(initialData?.closing_time || '22:00');
    const [maxGuests, setMaxGuests] = useState(initialData?.max_guests_per_slot || '50');
    const [latitude, setLatitude] = useState(initialData?.latitude || '');
    const [longitude, setLongitude] = useState(initialData?.longitude || '');
    
    const [image, setImage] = useState(null); 
    const [preview, setPreview] = useState(initialData?.image || null);
    
    const [gallery, setGallery] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    
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
        const files = Array.from(e.target.files);
        setGallery(files);
        setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('destination', selectedDestination);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('average_cost', averageCost); 
        formData.append('rating', rating);
        formData.append('opening_time', openingTime);
        formData.append('closing_time', closingTime);
        formData.append('max_guests_per_slot', maxGuests);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        
        if (image) formData.append('image', image);
        gallery.forEach(file => formData.append('gallery_images', file));

        try {
            const token = localStorage.getItem('access_token');
            const url = isEditMode 
                ? `http://localhost:8000/api/restaurants/${initialData.id}/` 
                : 'http://localhost:8000/api/restaurants/';
            const method = isEditMode ? 'patch' : 'post';

            const res = await axios[method](url, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });

            if (onSuccess) {
                onSuccess(res.data);
            } else {
                alert(`Restaurant successfully ${isEditMode ? 'updated' : 'added'}!`);
                navigate('/admin'); 
            }
        } catch (error) {
            setErrorMessage(`Failed to ${isEditMode ? 'update' : 'add'} restaurant. Ensure backend is migrated.`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 pb-20 pt-10 px-6">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-500">

                    <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 mb-8 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                        <ArrowLeft size={16} /> {isEditMode ? 'Cancel Editing' : 'Back to Command Center'}
                    </button>

                    <div className="mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            {isEditMode ? <PenTool className="text-orange-500" size={32}/> : <Utensils className="text-orange-500" size={32}/>}
                            {isEditMode ? 'Edit Restaurant Profile' : 'Add New Restaurant'}
                        </h2>
                    </div>

                    {errorMessage && <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 text-sm font-bold">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="bg-orange-50/50 dark:bg-orange-950/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900 mb-8">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><MapPin size={18} className="text-orange-500"/> Select Destination</label>
                            <select required value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} className="w-full px-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-bold text-gray-800 dark:text-white shadow-sm cursor-pointer">
                                <option value="" disabled>-- Choose the city --</option>
                                {destinations.map(dest => <option key={dest.id} value={dest.id}>{dest.name}</option> )}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Restaurant Name</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" placeholder="e.g., Bukhara" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><AlignLeft size={16}/> Cuisine & Description</label>
                                <textarea required rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg resize-none"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><MapPin size={16} className="text-orange-500"/> Latitude</label>
                                <input type="number" step="any" required value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" placeholder="41.8902" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><MapPin size={16} className="text-orange-500"/> Longitude</label>
                                <input type="number" step="any" required value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" placeholder="12.4922" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><span className="text-xl font-black text-orange-500">₹</span> Average Cost (₹)</label>
                                <input type="number" step="any" required value={averageCost} onChange={(e) => setAverageCost(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" placeholder="1500" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Star size={16}/> Star Rating (1.0 - 5.0)</label>
                                <input type="number" step="0.1" min="1" max="5" required value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" placeholder="4.9" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Clock size={16} className="text-orange-500"/> Opening Time</label>
                                <input type="time" required value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Clock size={16} className="text-orange-500"/> Closing Time</label>
                                <input type="time" required value={closingTime} onChange={(e) => setClosingTime(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Users size={16} className="text-orange-500"/> Max Guests Per Slot</label>
                                <input type="number" required value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all font-medium text-lg" placeholder="50" />
                            </div>

                            <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><UploadCloud size={16}/> {isEditMode ? 'Replace Signature Image' : 'Main Signature Dish Image'}</label>
                                <input type="file" required={!isEditMode} onChange={handleMainImageChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer w-full text-gray-500 dark:text-gray-400" />
                                {preview && <img src={preview} alt="Preview" className="mt-3 h-24 rounded-lg object-cover shadow-sm" />}
                                {isEditMode && !image && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Leave blank to keep current image.</p>}
                            </div>

                            <div className="p-5 bg-orange-50/50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Images size={16} className="text-orange-500"/> {isEditMode ? 'Replace Menu Gallery' : 'Dining Area & Menu Gallery'}</label>
                                <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white file:text-orange-700 hover:file:bg-orange-100 cursor-pointer w-full border border-orange-100 dark:border-orange-900 shadow-sm text-gray-500 dark:text-gray-400" />

                                {galleryPreviews.length > 0 && (
                                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                        {galleryPreviews.map((src, i) => <img key={i} src={src} alt="Gallery" className="h-20 w-20 object-cover rounded-xl shadow-sm border border-orange-200 dark:border-orange-800 flex-shrink-0" /> )}
                                    </div>
                                )}
                                {isEditMode && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Selecting files will overwrite the old gallery.</p>}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-gray-900 dark:bg-orange-600 hover:bg-black dark:hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-xl">
                                {isSaving ? 'Saving to Database...' : <><Save size={24} /> {isEditMode ? 'Save Changes' : 'Publish Restaurant'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RestaurantForm;