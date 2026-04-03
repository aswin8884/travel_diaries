import { useState } from 'react';
import { Send, ImagePlus, X, MapPin } from 'lucide-react';

const CreatePost = ({ currentUser, onPostSubmit, destinations = [] }) => {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [destinationId, setDestinationId] = useState('');

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) return alert("Maximum 3 photos per post.");
        setImages([...images, ...files]);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!text.trim() && images.length === 0) return;
        const formData = new FormData();
        formData.append('text', text);
        images.forEach(img => formData.append('images', img));
        if (destinationId) formData.append('destination_id', destinationId);
        onPostSubmit(formData);
        setText('');
        setImages([]);
        setDestinationId('');
    };

    return (
        <form onSubmit={submit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-3xl shadow-sm mb-6 animate-in fade-in duration-500">
            <div className="flex gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center text-base font-black shrink-0">
                    {currentUser?.initial}
                </div>
                <div className="flex-1 min-w-0">
                    <textarea
                        value={text} onChange={e => setText(e.target.value)}
                        placeholder="Share your travel memory..."
                        className="w-full bg-transparent border-none outline-none resize-none font-medium text-gray-800 dark:text-gray-100 text-base placeholder-gray-400 dark:placeholder-gray-600" rows="2"
                    />

                    {/* Optional destination tag */}
                    <div className="mt-3">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-blue-500 shrink-0"/>
                            <select
                                value={destinationId}
                                onChange={e => setDestinationId(e.target.value)}
                                className="flex-1 text-sm font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl px-3 py-2 outline-none focus:border-blue-400 transition-colors"
                            >
                                <option value="">Tag a destination (optional)</option>
                                {destinations.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="flex gap-3 mt-3 mb-2 overflow-x-auto pb-1">
                            {images.map((file, idx) => (
                                <div key={idx} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt=""/>
                                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-red-500 transition-colors">
                                        <X size={11}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <label className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 px-4 py-2 rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors text-sm">
                            <ImagePlus size={16}/> Photos ({images.length}/3)
                            <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden"/>
                        </label>
                        <button type="submit" disabled={!text.trim() && images.length === 0}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold shadow-md shadow-blue-500/20 disabled:opacity-40 transition-all text-sm">
                            <Send size={14}/> Post
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreatePost;
