import { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, X, Sparkles } from 'lucide-react';
import axios from 'axios';

const AVATAR_COLORS = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
    'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-pink-500', 'bg-teal-500'
];

const getAvatarColor = (letter) => {
    if (!letter) return AVATAR_COLORS[0];
    return AVATAR_COLORS[(letter.charCodeAt(0) || 0) % AVATAR_COLORS.length];
};

const Avatar = ({ item }) => {
    if (item.author_profile_picture) {
        return (
            <img
                src={item.author_profile_picture}
                alt={item.author_name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 shrink-0"
            />
        );
    }
    return (
        <div className={`w-9 h-9 ${getAvatarColor(item.author_initial)} rounded-full flex items-center justify-center font-black text-white text-sm ring-2 ring-white/20 shrink-0`}>
            {item.author_initial || '?'}
        </div>
    );
};

const FeedbackCard = ({ item }) => (
    <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 p-6 rounded-3xl w-80 shrink-0 shadow-xl text-white hover:bg-white/[0.12] hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "text-yellow-400" : "text-gray-600"} />
            ))}
        </div>
        <p className="text-gray-300 font-medium text-sm italic mb-5 line-clamp-3 leading-relaxed">
            "{item.text || item.comment}"
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Avatar item={item} />
            <div>
                <p className="font-bold text-sm text-white">{item.author_name}</p>
                <p className="text-xs text-gray-500">Verified Traveler</p>
            </div>
        </div>
    </div>
);

const FeedbackBanner = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFeedback, setNewFeedback] = useState({ rating: 5, text: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            const res = await axios.get('http://localhost:8000/api/feedback/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(res.data.results || res.data);
        } catch (error) {
            console.error("Failed to fetch feedback", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
        if (token) fetchFeedbacks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const wordCount = newFeedback.text.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 50) return alert(`Feedback is ${wordCount} words. Max 50.`);
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/feedback/', newFeedback, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            setNewFeedback({ rating: 5, text: '' });
            fetchFeedbacks();
        } catch {
            alert("Failed to submit feedback. Please log in.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoggedIn) return null;

    const useMarquee = feedbacks.length >= 4;
    const marqueeItems = useMarquee
        ? [...feedbacks, ...feedbacks, ...feedbacks]
        : feedbacks;

    return (
        <div className="w-full bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 py-16 relative overflow-hidden">
            {/* BG orbs */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {useMarquee && (
                <style>{`
                    @keyframes marqueeScroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.333%); }
                    }
                    .marquee-track {
                        display: flex;
                        width: max-content;
                        animation: marqueeScroll 45s linear infinite;
                    }
                    .marquee-track:hover { animation-play-state: paused; }
                `}</style>
            )}

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-blue-400" size={16}/>
                        <span className="text-blue-400 text-xs font-black uppercase tracking-widest">Community Reviews</span>
                    </div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <MessageSquareQuote className="text-blue-400"/> Traveler Voices
                    </h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">Real experiences from our travel community.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-blue-900/30 transition-all hover:scale-105 flex items-center gap-2 shrink-0"
                >
                    <Star size={15} fill="currentColor"/> Leave Feedback
                </button>
            </div>

            {/* Cards */}
            {feedbacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-medium">
                    Be the first to share your experience!
                </div>
            ) : useMarquee ? (
                <div className="w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none"></div>
                    <div className="marquee-track gap-5 px-6 py-2 cursor-pointer">
                        {marqueeItems.map((item, idx) => <FeedbackCard key={idx} item={item} />)}
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap gap-5 justify-center">
                        {feedbacks.map((item, idx) => <FeedbackCard key={idx} item={item} />)}
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl border border-gray-100 dark:border-gray-800">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-all">
                            <X size={17}/>
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center">
                                <MessageSquareQuote className="text-blue-600" size={20}/>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Rate Your Experience</h3>
                                <p className="text-gray-400 text-xs">Max 50 words · Shown to all members</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-2 justify-center mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                                {[1,2,3,4,5].map(star => (
                                    <button type="button" key={star} onClick={() => setNewFeedback({...newFeedback, rating: star})} className="hover:scale-125 transition-transform focus:outline-none">
                                        <Star size={34} className={star <= newFeedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                required rows="4"
                                value={newFeedback.text}
                                onChange={(e) => setNewFeedback({...newFeedback, text: e.target.value})}
                                placeholder="Share your travel experience..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-medium mb-1 resize-none transition-all"
                            />
                            <div className="flex justify-between items-center mb-5">
                                <span className="text-xs text-gray-400">Keep it short and genuine</span>
                                <span className={`text-xs font-bold ${(newFeedback.text.trim().split(/\s+/).filter(Boolean).length) > 45 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {newFeedback.text.trim() ? newFeedback.text.trim().split(/\s+/).filter(Boolean).length : 0} / 50
                                </span>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all flex items-center justify-center gap-2">
                                {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Submitting...</> : <><Star size={15} fill="currentColor"/>Submit Feedback</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackBanner;
