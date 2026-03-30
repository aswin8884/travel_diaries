import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { MapPin, Search, Compass, Star, Heart, MessageCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';
import axios from 'axios';
import CustomerModal from './CustomerModal.jsx';
import FeedbackBanner from '../../components/global/FeedbackBanner';

const Home = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [selectedDest, setSelectedDest] = useState(null);
    const [isModalActive, setIsModalActive] = useState(false);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/destinations/');
                setDestinations(res.data.results || res.data);
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        fetchDestinations();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    const filteredDestinations = destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (dest.short_description && dest.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Compass className="text-blue-600 animate-spin" size={64} strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
                        className="w-full h-full object-cover scale-105"
                        alt="Hero background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-white"></div>
                </div>
                
                <div className="max-w-5xl mx-auto relative z-10 text-center px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <MapPin size={14} className="text-blue-400"/> Explore the World
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Find your next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">great escape.</span>
                    </h1>
                    
                    <div className="max-w-2xl mx-auto relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                        <input 
                            type="text" 
                            placeholder="Where do you want to go?" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 bg-white border-none text-gray-900 placeholder-gray-400 rounded-2xl outline-none ring-1 ring-black/5 focus:ring-4 focus:ring-blue-500/20 transition-all text-xl font-bold shadow-2xl"
                        />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Trending Adventures</h2>
                        <p className="text-lg text-gray-500 font-medium">Curated destinations picked by our global community of travelers.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredDestinations.map((dest) => (
                        <div 
                            key={dest.id} 
                            onClick={() => { setSelectedDest(dest); setIsModalActive(true); }} 
                            className="group cursor-pointer relative"
                        >
                            <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl transition-all duration-500 group-hover:shadow-blue-500/20 group-hover:-translate-y-2">
                                <img src={getImageUrl(dest.image)} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                
                                <div className="absolute top-6 right-6">
                                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-gray-900 font-black shadow-sm">
                                 <Star size={16} fill={dest.rating ? "currentColor" : "none"} className={dest.rating ? "text-yellow-500" : "text-gray-400"} />
                                 {dest.rating ? dest.rating : <span className="text-xs text-gray-500 uppercase tracking-tighter">Not Rated</span>}
                                </div>
                                </div>

                                <div className="absolute bottom-8 left-8 right-8">
                                    <h3 className="text-3xl font-black text-white mb-2">{dest.name}</h3>
                                    <p className="text-white/80 font-medium line-clamp-2 text-sm">{dest.short_description || dest.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="pb-24">
                <FeedbackBanner />
            </div>
            <div className="bg-gray-50 py-32 rounded-t-[5rem] border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest mb-6">
                                <ImageIcon size={20} /> traveler feed
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-tight">
                                Shared by our <span className="text-blue-600">Community.</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed">
                                Explore thousands of real photos and honest reviews from fellow travelers around the globe. Join us to start sharing your own story.
                            </p>
                            <Link to="/community" className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:bg-blue-600 transition-all hover:gap-5 shadow-2xl">
                                Explore Community <ArrowRight size={20} />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="bg-blue-600 rounded-[3rem] p-12 text-center shadow-2xl shadow-blue-600/30">
                                <h3 className="text-4xl font-black text-white mb-4">Join the Club</h3>
                                <p className="text-blue-100 text-lg font-medium mb-10">Create an account to leave reviews, post photos, and get exclusive travel deals.</p>
                                <Link to="/register" className="block bg-white text-blue-600 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl">
                                    Sign Up Free
                                </Link>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full -z-10 blur-2xl opacity-50"></div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomerModal 
                dest={selectedDest} 
                isActive={isModalActive} 
                onClose={() => {
                    setIsModalActive(false);
                    setTimeout(() => setSelectedDest(null), 300);
                }} 
                getImageUrl={getImageUrl} 
            />
        </div>
    );
};

export default Home;