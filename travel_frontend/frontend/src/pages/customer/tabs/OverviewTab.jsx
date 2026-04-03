import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AlignLeft, Map, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const OverviewTab = ({ dest, getImageUrl }) => {
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const images = dest.images || [];
    const isOpen = lightboxIndex !== null;

    const openAt = (idx) => setLightboxIndex(idx);
    const close = () => setLightboxIndex(null);
    const prev = useCallback(() => setLightboxIndex(i => (i - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setLightboxIndex(i => (i + 1) % images.length), [images.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') prev();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, prev, next]);

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${dest.longitude - 0.05}%2C${dest.latitude - 0.05}%2C${dest.longitude + 0.05}%2C${dest.latitude + 0.05}&layer=mapnik&marker=${dest.latitude}%2C${dest.longitude}`;

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in">
                <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <AlignLeft size={18} className="text-blue-500"/> The Experience
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg font-medium mb-10">{dest.long_description}</p>

                    {images.length > 0 && (
                        <div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Gallery</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => openAt(idx)}
                                        className="h-28 md:h-36 relative rounded-2xl overflow-hidden shadow-sm group bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <img
                                            src={getImageUrl(img.image)}
                                            alt="Gallery"
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                            <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Map size={18} className="text-blue-500"/> Location Map
                    </h4>
                    <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 relative">
                        <iframe width="100%" height="100%" src={mapUrl} className="absolute inset-0 w-full h-full border-0" title="Map"></iframe>
                    </div>
                </div>
            </div>

            {/* Lightbox — rendered via portal to escape modal stacking context */}
            {isOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={close}
                >
                    {/* Single close button */}
                    <button
                        onClick={close}
                        className="absolute top-5 right-5 group flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-4 py-2.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all duration-200"
                    >
                        <X size={18} strokeWidth={2.5} />
                        <span>Close</span>
                    </button>

                    {/* Counter */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 border border-white/20 text-white text-xs font-black px-4 py-2 rounded-full backdrop-blur-md">
                        {lightboxIndex + 1} / {images.length}
                    </div>

                    {/* Prev */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 md:left-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110"
                        >
                            <ChevronLeft size={26} strokeWidth={2.5} />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative max-w-5xl max-h-[85vh] w-full px-20 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            key={lightboxIndex}
                            src={getImageUrl(images[lightboxIndex].image)}
                            alt={`Gallery ${lightboxIndex + 1}`}
                            className="max-h-[85vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                        />
                    </div>

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 md:right-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110"
                        >
                            <ChevronRight size={26} strokeWidth={2.5} />
                        </button>
                    )}

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4">
                            {images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${idx === lightboxIndex ? 'border-white scale-110' : 'border-white/30 opacity-50 hover:opacity-80'}`}
                                >
                                    <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};

export default OverviewTab;
