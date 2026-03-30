import { useState } from 'react';
import { Trash2, X, PenTool } from 'lucide-react';
import axios from 'axios';

// Import our new sub-components!
import DestinationView from './DestinationView';
import DestinationEdit from './DestinationEdit';

const DestinationsTab = ({ destinations, setDestinations, selectedDest, openModal, closeModal, isModalActive }) => {
    const [isEditing, setIsEditing] = useState(false);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `http://localhost:8000${formattedPath}`;
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation(); 
        if (!window.confirm("Are you sure you want to permanently delete this destination?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/destinations/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
            setDestinations(destinations.filter(d => d.id !== id));
            closeModal(); 
        } catch (error) { alert("Failed to delete destination."); }
    };

    // When the edit form finishes saving, it passes the new data back up here
    const handleEditSuccess = (updatedDest) => {
        setDestinations(destinations.map(d => d.id === updatedDest.id ? updatedDest : d));
        openModal(updatedDest); // Update the modal with the new data
        setIsEditing(false); // Flip back to view mode
    };

    if (destinations.length === 0) return <p className="text-center text-gray-500 py-12 bg-white/50 rounded-3xl">No destinations found. Add one!</p>;

    return (
        <div className="animate-in fade-in duration-500">
            {/* GRID VIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destinations.map(dest => (
                    <div key={dest.id} onClick={() => { openModal(dest); setIsEditing(false); }} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all cursor-pointer relative group hover:-translate-y-1">
                        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button onClick={(e) => { e.stopPropagation(); openModal(dest); setIsEditing(true); }} className="p-2.5 bg-white/90 backdrop-blur-md text-gray-800 hover:bg-blue-600 hover:text-white rounded-xl"><PenTool size={18} /></button>
                            <button onClick={(e) => handleDelete(dest.id, e)} className="p-2.5 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-xl"><Trash2 size={18} /></button>
                        </div>
                        <div className="h-56 overflow-hidden bg-gray-100">
                            <img src={getImageUrl(dest.image)} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{dest.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{dest.short_description || dest.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CINEMATIC MODAL */}
            {selectedDest && (
                <div 
                    className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-2 md:p-6 transition-opacity duration-300 ${isModalActive ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={closeModal}
                >
                    <div 
                        className={`w-full max-w-[95vw] xl:max-w-[1300px] h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300 ${isModalActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        onClick={e => e.stopPropagation()} 
                    >
                        {/* THE EXIT BUTTON (Fixed & Hover Red) */}
                        <div className="absolute top-6 right-6 z-[120]">
                            <button onClick={closeModal} className="p-3.5 bg-gray-200/50 hover:bg-red-500 hover:text-white text-gray-800 rounded-full shadow-xl border border-gray-100 backdrop-blur-md transition-all duration-300 hover:scale-110">
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="overflow-y-auto w-full h-full z-10 relative hide-scrollbar">
                            {!isEditing ? (
                                <DestinationView dest={selectedDest} getImageUrl={getImageUrl} />
                            ) : (
                                <DestinationEdit dest={selectedDest} onCancel={() => setIsEditing(false)} onSuccess={handleEditSuccess} />
                            )}
                        </div>

                        {/* FLOATING ACTION DOCK (Hidden while editing) */}
                        {!isEditing && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[150] flex gap-3 p-2 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2rem] shadow-2xl">
                                <button onClick={() => setIsEditing(true)} className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-3 text-lg hover:scale-105 active:scale-95">
                                    <PenTool size={20} /> Edit Details
                                </button>
                                <button onClick={(e) => handleDelete(selectedDest.id, e)} className="px-6 py-3.5 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center gap-3 text-lg hover:scale-105 active:scale-95">
                                    <Trash2 size={20} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DestinationsTab;