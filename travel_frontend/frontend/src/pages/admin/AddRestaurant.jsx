import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, Utensils, MapPin, AlignLeft, Star, ArrowLeft, Save, Images } from 'lucide-react';
import axios from 'axios';

const AddRestaurant = () => {
    const navigate = useNavigate();
    
    // Form State
    const [destinations, setDestinations] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(''); 
    const [rating, setRating] = useState('');
    
    // Image State
    const [image, setImage] = useState(null); // Main Cover Image
    const [preview, setPreview] = useState(null);
    
    // 🔥 NEW: Gallery (Multi-Image) State
    const [gallery, setGallery] = useState([]);
    
    const [isSaving, setIsSaving] = useState(false);

    // Fetch destinations so the admin can assign this restaurant to a city
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
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // 🔥 NEW: Handle multi-file selection for the gallery
    const handleGalleryChange = (e) => {
        setGallery(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('destination', selectedDestination);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price); 
        formData.append('rating', rating);
        if (image) formData.append('image', image);

        // 🔥 NEW: Append multiple gallery images under the key 'gallery'
        gallery.forEach(file => {
            formData.append('gallery', file);
        });

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/restaurants/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Restaurant successfully added!");
            navigate('/admin'); 
        } catch (error) {
            console.error(error);
            alert("Failed to add restaurant. Ensure your backend handles 'gallery' uploads.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30 pb-20 pt-10 px-6">
            <div className="max-w-4xl mx-auto relative z-10">
                
                <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-500 mb-8 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        <ArrowLeft size={16} /> Back to Command Center
                    </Link>
                    
                    <div className="mb-10 pb-6 border-b border-gray-100">
                        <h2 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                            <Utensils className="text-orange-500" size={32}/> Add New Restaurant
                        </h2>
                        <p className="text-gray-500 font-medium">Curate top-tier dining experiences for your destinations.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* DESTINATION DROPDOWN */}
                        <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 mb-8">
                            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin size={18} className="text-orange-500"/> Select Destination
                            </label>
                            <select required value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 shadow-sm cursor-pointer">
                                <option value="" disabled>-- Choose the city --</option>
                                {destinations.map(dest => (
                                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Restaurant Name</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg" placeholder="e.g., Bukhara" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><AlignLeft size={16}/> Cuisine & Description</label>
                                <textarea required rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg resize-none" placeholder="Describe the atmosphere, signature dishes, and culinary style..."></textarea>
                            </div>

                            <div>
                                {/* 🔥 INDIAN RUPEE FORMATTING 🔥 */}
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><span className="text-xl font-black text-orange-500">₹</span> Average Cost (₹)</label>
                                <input type="number" step="1" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg" placeholder="1500" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Star size={16}/> Star Rating (1.0 - 5.0)</label>
                                <input type="number" step="0.1" min="1" max="5" required value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-lg" placeholder="4.9" />
                            </div>

                            {/* Main Image Upload */}
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><UploadCloud size={16}/> Main Signature Dish Image</label>
                                <input type="file" required onChange={handleMainImageChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer w-full" />
                                {preview && <img src={preview} alt="Preview" className="mt-3 h-24 rounded-lg object-cover shadow-sm" />}
                            </div>

                            {/* 🔥 NEW: Gallery Upload (allowing 'multiple') 🔥 */}
                            <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Images size={16} className="text-orange-500"/> Dining Area & Menu Gallery (Multi-upload)</label>
                                <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white file:text-orange-700 hover:file:bg-orange-100 cursor-pointer w-full border border-orange-100 shadow-sm" />
                                {gallery.length > 0 && <p className="text-xs text-orange-600 font-bold mt-2">{gallery.length} files selected.</p>}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-xl">
                                {isSaving ? 'Saving to Database...' : <><Save size={24} /> Publish Restaurant</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRestaurant;