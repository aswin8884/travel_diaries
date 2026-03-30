import { useState } from 'react';
import { PenTool, Save, ArrowLeft, UploadCloud, Images } from 'lucide-react';
import axios from 'axios';

const DestinationEdit = ({ dest, onCancel, onSuccess }) => {
    const [editForm, setEditForm] = useState({
        name: dest.name,
        short_description: dest.short_description || '',
        description: dest.description || '',
        latitude: dest.latitude || '',
        longitude: dest.longitude || ''
    });
    
    const [newImage, setNewImage] = useState(null);
    const [newGallery, setNewGallery] = useState([]);
    
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('short_description', editForm.short_description);
        formData.append('description', editForm.description);
        formData.append('latitude', editForm.latitude);
        formData.append('longitude', editForm.longitude);
        
        if (newImage) formData.append('image', newImage);
    
        newGallery.forEach(file => {
            formData.append('gallery', file);
        });

        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.patch(`http://localhost:8000/api/destinations/${dest.id}/`, formData, { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                } 
            });
            onSuccess(res.data); 
        } catch (error) { 
            console.error(error);
            alert("Failed to update details."); 
        } finally { 
            setIsSaving(false); 
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
            <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <button onClick={onCancel} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Cancel Editing
                </button>
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3"><PenTool className="text-blue-600"/> Edit Destination Profile</h2>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Destination Name</label>
                        <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                        <input type="text" maxLength="150" value={editForm.short_description} onChange={(e) => setEditForm({...editForm, short_description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Long Description</label>
                        <textarea required rows="6" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg resize-none"></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                            <input type="number" step="any" required value={editForm.latitude} onChange={(e) => setEditForm({...editForm, latitude: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                            <input type="number" step="any" required value={editForm.longitude} onChange={(e) => setEditForm({...editForm, longitude: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><UploadCloud size={16} className="text-blue-500"/> Replace Main Image</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setNewImage(e.target.files[0])} 
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer w-full"
                            />
                            <p className="text-xs text-gray-400 mt-2">Leave blank to keep current image.</p>
                        </div>
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Images size={16} className="text-blue-500"/> Replace Entire Gallery</label>
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={(e) => setNewGallery(Array.from(e.target.files))} 
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer w-full"
                            />
                            <p className="text-xs text-gray-400 mt-2">Selecting files here will overwrite the old gallery.</p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button type="submit" disabled={isSaving} className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-xl">
                            {isSaving ? 'Saving Changes...' : <><Save size={24} /> Save Destination</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DestinationEdit;