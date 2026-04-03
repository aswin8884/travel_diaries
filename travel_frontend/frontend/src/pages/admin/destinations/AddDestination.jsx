import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, MapPin, AlignLeft, ArrowLeft, Save, Images, Star } from 'lucide-react';
import axios from 'axios';

const AddDestination = () => {
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [longDesc, setLongDesc] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [rating, setRating] = useState(''); // 🔥 Added Rating State
    
    const [image, setImage] = useState(null); 
    const [preview, setPreview] = useState(null);
    const [gallery, setGallery] = useState([]);
    
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        setGallery(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('short_description', shortDesc);
        formData.append('long_description', longDesc);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('rating', rating); // 🔥 Appended Rating
        
        if (image) formData.append('image', image);
        gallery.forEach(file => {
            formData.append('gallery_images', file);
        });

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/destinations/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Destination successfully added!");
            navigate('/admin'); 
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to add destination.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 pb-20 pt-10 px-6">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-500">

                    <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                        <ArrowLeft size={16} /> Back to Command Center
                    </Link>

                    <div className="mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            <MapPin className="text-indigo-600" size={32}/> Add New Destination
                        </h2>
                    </div>

                    {errorMessage && <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 text-sm font-bold">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Destination Name</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all font-medium text-lg" placeholder="e.g., Paris, Bali, Tokyo" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Short Tagline</label>
                                <input type="text" required value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all font-medium text-lg" placeholder="e.g., The City of Lights" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><AlignLeft size={16}/> Full Description</label>
                                <textarea required rows="4" value={longDesc} onChange={(e) => setLongDesc(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all font-medium text-lg resize-none"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><MapPin size={16} className="text-indigo-500"/> Latitude</label>
                                <input type="number" step="any" required value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all font-medium text-lg" placeholder="48.8566" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><MapPin size={16} className="text-indigo-500"/> Longitude</label>
                                <input type="number" step="any" required value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all font-medium text-lg" placeholder="2.3522" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Star size={16} className="text-yellow-500" /> Star Rating (1.0 - 5.0)
                                </label>
                                <input type="number" step="0.1" min="1" max="5" required value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all font-medium text-lg" placeholder="4.9" />
                            </div>

                            <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><UploadCloud size={16} className="text-indigo-600"/> Main Cover Image</label>
                                <input type="file" required onChange={handleMainImageChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-bold file:bg-white file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer w-full border border-indigo-100 dark:border-indigo-900 shadow-sm text-gray-500 dark:text-gray-400" />
                                {preview && <img src={preview} alt="Preview" className="mt-3 h-24 rounded-lg object-cover shadow-sm" />}
                            </div>

                            <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Images size={16} className="text-indigo-600"/> Destination Gallery</label>
                                <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-bold file:bg-white file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer w-full border border-indigo-100 dark:border-indigo-900 shadow-sm text-gray-500 dark:text-gray-400" />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-xl">
                                {isSaving ? 'Saving...' : <><Save size={24} /> Publish Destination</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDestination;