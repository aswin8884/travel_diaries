import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, CalendarCheck } from 'lucide-react';

const StaysTab = ({ hotels, getImageUrl, onClose }) => {
    const navigate = useNavigate();
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const calculateDays = () => {
        if (!checkIn || !checkOut) return 1;
        const diffTime = new Date(checkOut) - new Date(checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const today = new Date().toISOString().split('T')[0];

const handleBooking = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            onClose();
            navigate('/login');
            return;
        }
        if (!checkIn || !checkOut) return alert("Please select dates.");   
        onClose();
        navigate('/checkout', { 
            state: { 
                type: 'hotel', 
                item: selectedHotel, 
                checkIn, 
                checkOut, 
                days: calculateDays(),
                total: selectedHotel.price_per_night * calculateDays()
            } 
        });
    };

    if (selectedHotel) {
        return (
            <div className="animate-in slide-in-from-right-8 fade-in">
                <button onClick={() => setSelectedHotel(null)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-bold bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 transition-all hover:-translate-x-1"><ArrowLeft size={18}/> Back to all Stays</button>
                <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 flex flex-col p-4 gap-4 bg-gray-50/50">
                        <div className="w-full h-[30vh] lg:h-[40vh] relative rounded-3xl overflow-hidden shadow-sm">
                            <img src={getImageUrl(selectedHotel.image)} alt={selectedHotel.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        {selectedHotel.gallery?.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {selectedHotel.gallery.map(img => (
                                    <div key={img.id} className="h-24 relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                        <img src={getImageUrl(img.image)} className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="flex items-center gap-2 text-yellow-500 font-black bg-yellow-50 px-3.5 py-1.5 rounded-lg w-max mb-4 shadow-sm border border-yellow-100"><Star size={16} fill="currentColor"/> {selectedHotel.rating} Star Premium Stay</div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">{selectedHotel.name}</h2>
                        <div className="flex-grow overflow-y-auto hide-scrollbar max-h-[30vh] mb-8 pr-4">
                            <p className="text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-line">{selectedHotel.description}</p>
                        </div>
                        <div className="mt-auto p-6 bg-blue-50/50 rounded-3xl border border-blue-100 shadow-sm">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={14}/> Check-in</label>
                                    <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 font-bold text-gray-700 shadow-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={14}/> Check-out</label>
                                    <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} disabled={!checkIn} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 font-bold text-gray-700 shadow-sm disabled:opacity-50"/>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-blue-200/50">
                                <div>
                                    <p className="text-sm font-bold text-gray-500 mb-1">Total for {calculateDays()} nights</p>
                                    <p className="text-3xl font-black text-gray-900">₹{selectedHotel.price_per_night * calculateDays()}</p>
                                </div>
                                <button onClick={handleBooking} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"><CalendarCheck size={20}/> Book Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (hotels.length === 0) return <p className="text-gray-500 font-medium py-12 bg-white rounded-3xl text-center shadow-sm">No hotels listed.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
            {hotels.map(hotel => (
                <div key={hotel.id} onClick={() => setSelectedHotel(hotel)} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 overflow-hidden group">
                    <div className="h-56 bg-gray-100 relative overflow-hidden">
                        <img src={getImageUrl(hotel.image)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-sm"><Star size={14} className="text-yellow-500" fill="currentColor"/> {hotel.rating}</div>
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{hotel.name}</h3>
                        <p className="text-gray-500 text-base line-clamp-2 mb-6 font-medium">{hotel.description}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-4">
                            <span className="text-2xl font-black text-gray-900">₹{hotel.price_per_night}</span>
                            <div className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold group-hover:bg-blue-600 transition-colors">View Details</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StaysTab;