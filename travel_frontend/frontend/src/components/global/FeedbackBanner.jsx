import { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, X } from 'lucide-react';
import axios from 'axios';

const FeedbackBanner = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFeedback, setNewFeedback] = useState({ rating: 5, text: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/feedback/');
            setFeedbacks(res.data.results || res.data);
        } catch (error) { console.error("Failed to fetch feedback", error); }
    };

    useEffect(() => {
        fetchFeedbacks();
        setIsLoggedIn(!!localStorage.getItem('access_token'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const wordCount = newFeedback.text.trim().split(/\s+/).length;
        if (wordCount > 50) return alert(`Your feedback is ${wordCount} words. Please keep it under 50 words.`);

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/feedback/', newFeedback, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            setNewFeedback({ rating: 5, text: '' });
            fetchFeedbacks(); // Refresh the banner!
            alert("Thank you for your feedback!");
        } catch (error) {
            alert("Failed to submit feedback. Ensure you are logged in.");
        }
    };

    if (feedbacks.length === 0) return null;

    // We duplicate the array so the infinite scroll animation loops seamlessly
    const infiniteFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks];

    return (
        <div className="w-full bg-gray-900 py-12 relative overflow-hidden flex flex-col items-center">
            
            {/* Custom CSS for the Infinite Marquee Animation */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: scroll 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-6 mb-8 w-full flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2"><MessageSquareQuote className="text-blue-500"/> Traveler Voices</h2>
                    <p className="text-gray-400 font-medium text-sm mt-1">See what our community is saying about their experiences.</p>
                </div>
                {isLoggedIn && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-colors">
                        Leave Feedback
                    </button>
                )}
            </div>

            {/* Scrolling Banner */}
            <div className="w-full relative">
                {/* Gradient fades on the edges for a smooth look */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

                <div className="animate-marquee gap-6 px-6 cursor-pointer">
                    {infiniteFeedbacks.map((item, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl w-80 shrink-0 shadow-xl text-white">
                            <div className="flex gap-1 mb-3 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} className={i >= item.rating ? "text-gray-600" : ""} />
                                ))}
                            </div>
                            <p className="text-gray-300 font-medium text-sm italic mb-4 line-clamp-3">"{item.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-black text-sm">{item.author_initial}</div>
                                <span className="font-bold text-sm text-gray-200">{item.author_name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leave Feedback Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative animate-in zoom-in-95">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20}/></button>
                        <h3 className="text-2xl font-black text-gray-900 mb-6">Rate your experience</h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-2 justify-center mb-6">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button type="button" key={star} onClick={() => setNewFeedback({...newFeedback, rating: star})} className="focus:outline-none hover:scale-110 transition-transform">
                                        <Star size={36} className={star <= newFeedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                                    </button>
                                ))}
                            </div>
                            
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Review (Max 50 words)</label>
                            <textarea 
                                required rows="4" value={newFeedback.text} 
                                onChange={(e) => setNewFeedback({...newFeedback, text: e.target.value})}
                                placeholder="Tell us about your trip..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-medium mb-2 resize-none"
                            ></textarea>
                            <p className="text-xs text-gray-400 font-medium text-right mb-6">Words: {newFeedback.text.trim() ? newFeedback.text.trim().split(/\s+/).length : 0} / 50</p>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">Submit Feedback</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackBanner;