import { useState } from 'react';
import { Send, ImagePlus, X } from 'lucide-react';

const CreatePost = ({ currentUser, onPostSubmit }) => {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);

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
        
        onPostSubmit(formData);
        
        setText('');
        setImages([]);
    };

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-10 animate-in fade-in duration-500">
            <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-black shrink-0">{currentUser?.initial}</div>
                <div className="flex-1">
                    <textarea 
                        value={text} onChange={(e) => setText(e.target.value)} 
                        placeholder="Share your travel memory or feedback..." 
                        className="w-full bg-transparent border-none outline-none resize-none font-medium text-gray-800 text-lg placeholder:text-gray-400" rows="2"
                    />
                    {images.length > 0 && (
                        <div className="flex gap-3 mt-4 mb-2 overflow-x-auto pb-2">
                            {images.map((file, idx) => (
                                <div key={idx} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500"><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <label className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                            <ImagePlus size={18} /> <span className="text-sm">Add Photos ({images.length}/3)</span>
                            <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                        </label>
                        <button type="submit" disabled={!text.trim() && images.length === 0} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-full font-bold shadow-md disabled:opacity-50">
                            <Send size={16}/> Post
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};
export default CreatePost;