import { MapPin, AlignLeft } from 'lucide-react';

const DestinationView = ({ dest, getImageUrl }) => {
    return (
        <div className="pb-40">
            
            <div className="w-full h-[45vh] md:h-[60vh] relative group overflow-hidden">
                <img src={getImageUrl(dest.image)} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-10">
                
                {dest.gallery && dest.gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-10">
                        {dest.gallery.map(img => (
                            <div key={img.id} className="h-40 md:h-48 relative rounded-3xl overflow-hidden shadow-sm group">
                                <img src={getImageUrl(img.image)} alt="Gallery" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                        <MapPin size={15} /> Destination
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-3">{dest.name}</h2>
                    <p className="text-lg md:text-xl font-medium text-gray-600 leading-tight max-w-4xl">{dest.short_description}</p>
                </div>
                
                <div className="max-w-5xl">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <AlignLeft size={18} className="text-blue-500"/> The Details
                    </h4>
                    <p className="text-gray-900 leading-relaxed whitespace-pre-line text-lg font-medium">
                        {dest.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DestinationView;