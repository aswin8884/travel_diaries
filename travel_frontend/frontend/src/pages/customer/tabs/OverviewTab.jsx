import { AlignLeft, Map } from 'lucide-react';

const OverviewTab = ({ dest, getImageUrl }) => {
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${dest.longitude - 0.05}%2C${dest.latitude - 0.05}%2C${dest.longitude + 0.05}%2C${dest.latitude + 0.05}&layer=mapnik&marker=${dest.latitude}%2C${dest.longitude}`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in">
            <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3"><AlignLeft size={18} className="text-blue-500"/> The Experience</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg font-medium mb-10">{dest.description}</p>
                {dest.gallery && dest.gallery.length > 0 && (
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Gallery</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {dest.gallery.map(img => (
                                <div key={img.id} className="h-24 md:h-32 relative rounded-2xl overflow-hidden shadow-sm group bg-gray-100">
                                    <img src={getImageUrl(img.image)} alt="Gallery" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3"><Map size={18} className="text-blue-500"/> Location Map</h4>
                <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-md border border-gray-200 bg-gray-100 relative">
                    <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src={mapUrl} className="absolute inset-0 w-full h-full" title="Map"></iframe>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;