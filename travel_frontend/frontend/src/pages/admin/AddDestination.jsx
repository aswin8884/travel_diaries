import { useState } from 'react';
import { UploadCloud, MapPin, AlignLeft, Globe, Map, Type, Images, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddDestination = () => {
    const [name, setName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    
    // Main Hero Image
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    
    // Multiple Gallery Images
    const [gallery, setGallery] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        // Convert the FileList object to an array
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGallery(files);
            // Create preview URLs for all selected images
            setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('short_description', shortDescription);
        formData.append('description', description);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        
        if (image) formData.append('image', image);
        
        // Loop through the gallery array and append each file using the SAME key ('gallery')
        // Django's `request.FILES.getlist('gallery')` specifically looks for this!
        gallery.forEach(file => {
            formData.append('gallery', file);
        });

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/destinations/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage({ type: 'success', text: 'Destination & Gallery successfully published!' });
            
            // Clear form
            setName(''); setShortDescription(''); setDescription(''); setLatitude(''); setLongitude('');
            setImage(null); setPreview(null); setGallery([]); setGalleryPreviews([]);
            
        } catch (error) {
            console.error("Upload error:", error);
            setMessage({ type: 'error', text: 'Failed to add destination. Ensure all fields are filled.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 mb-16 relative">
            <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-4 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-200">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <MapPin className="text-blue-600" size={32} /> Publish Destination
                    </h2>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-2xl mb-6 font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Destination Name</label>
                            <div className="relative">
                                <Map size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl outline-none" placeholder="e.g., Rome, Italy" />
                            </div>
                        </div>

                        {/* Short Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Short Description (Card Preview)</label>
                            <div className="relative">
                                <Type size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                <input type="text" required maxLength="150" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl outline-none" placeholder="A brief catchphrase for the preview card..." />
                            </div>
                        </div>

                        {/* Long Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Long Description (Detailed Modal)</label>
                            <div className="relative">
                                <AlignLeft size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="4"
                                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl outline-none resize-none" placeholder="Describe the culture, history, and vibe in detail..."></textarea>
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                            <input type="number" step="any" required value={latitude} onChange={(e) => setLatitude(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl outline-none" placeholder="41.9028" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                            <input type="number" step="any" required value={longitude} onChange={(e) => setLongitude(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl outline-none" placeholder="12.4964" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><UploadCloud size={16}/> Main Hero Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-3xl bg-white/50 p-4 text-center relative overflow-hidden h-40 flex flex-col justify-center items-center group">
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <p className="text-white font-bold">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm font-medium text-blue-600">Click to upload Main Image</p>
                                )}
                                <input type="file" required={!preview} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                            </div>
                        </div>

                        {/* Gallery Images Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Images size={16}/> Extra Gallery Photos</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-3xl bg-white/50 p-4 text-center relative overflow-hidden h-40 flex flex-col justify-center items-center group">
                                {galleryPreviews.length > 0 ? (
                                    <div className="flex gap-2 overflow-x-auto absolute inset-0 p-2 items-center bg-gray-50/90">
                                        {galleryPreviews.map((src, i) => (
                                            <img key={i} src={src} className="h-24 w-24 object-cover rounded-xl shadow-sm flex-shrink-0" alt={`Gallery ${i}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-blue-600">Select multiple images</p>
                                )}
                                {/* Note the "multiple" attribute here! */}
                                <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleGalleryChange} accept="image/*" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button type="submit" disabled={loading} className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
                            {loading ? 'Uploading safely to Django...' : 'Publish Full Destination'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDestination;