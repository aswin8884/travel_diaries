import { useState } from 'react';
import { MessageCircle, Heart, MapPin, Send } from 'lucide-react';

const PostCard = ({ post, currentUser, isLoggedIn, onLike, onComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const submitComment = () => {
        if (!commentText.trim()) return;
        onComment(post.id, commentText);
        setCommentText(''); // Clears ONLY this post's comment box!
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath}`;
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-black shrink-0">
                    {post.author_initial}
                </div>
                <div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight">{post.author_name}</h4>
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-0.5"><MapPin size={12}/> Global Explorer</p>
                </div>
            </div>
            
            {/* Text & Images */}
            {post.text && <p className="text-gray-800 font-medium mb-4 leading-relaxed text-lg whitespace-pre-line">{post.text}</p>}
            {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 mb-6 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {post.images.map((imgObj) => (
                        <div key={imgObj.id} className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-gray-100">
                            <img src={getImageUrl(imgObj.image)} alt="Upload" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 border-t border-gray-50 pt-4">
                <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 font-bold text-sm transition-colors ${post.is_liked_by_me ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                    <Heart size={18} className={post.is_liked_by_me ? "fill-red-500" : ""} /> {post.likes_count}
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 font-bold text-sm transition-colors">
                    <MessageCircle size={18}/> {post.comments?.length || 0} Comments
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2">
                    <div className="space-y-4 mb-4">
                        {(post.comments || []).map(comment => (
                            <div key={comment.id} className="flex gap-3 bg-gray-50 p-4 rounded-2xl">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-black shrink-0">{comment.author_initial}</div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm">{comment.author_name}</h5>
                                    <p className="text-gray-700 text-sm font-medium mt-0.5">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isLoggedIn && (
                        <div className="flex gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black shrink-0">{currentUser?.initial}</div>
                            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                                <input 
                                    type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." 
                                    className="w-full bg-transparent outline-none text-sm font-medium text-gray-800"
                                    onKeyDown={(e) => { if (e.key === 'Enter') submitComment(); }}
                                />
                                <button onClick={submitComment} disabled={!commentText.trim()} className="text-blue-600 disabled:text-gray-400 p-1"><Send size={16} /></button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default PostCard;