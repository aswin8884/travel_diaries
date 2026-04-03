import { useState } from 'react';
import { MessageCircle, Heart, MapPin, Send } from 'lucide-react';

const PostCard = ({ post, currentUser, isLoggedIn, onLike, onComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const submitComment = () => {
        if (!commentText.trim()) return;
        onComment(post.id, commentText);
        setCommentText('');
    };

    const getImageUrl = (p) => {
        if (!p) return '';
        if (p.startsWith('http')) return p;
        return `http://localhost:8000${p}`;
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm animate-in fade-in">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center text-base font-black shrink-0">
                    {post.author_initial}
                </div>
                <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-base leading-tight">{post.author_name}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                        <MapPin size={11}/> Global Explorer
                    </p>
                </div>
            </div>

            {/* Text */}
            {post.text && (
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-4 leading-relaxed whitespace-pre-line">{post.text}</p>
            )}

            {/* Images */}
            {post.images?.length > 0 && (
                <div className={`grid gap-2 mb-5 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {post.images.map(imgObj => (
                        <div key={imgObj.id} className="w-full h-52 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img src={getImageUrl(imgObj.image)} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => onLike(post.id)}
                    className={`flex items-center gap-1.5 font-bold text-sm transition-all ${post.is_liked_by_me ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 hover:text-red-500'}`}>
                    <Heart size={17} className={post.is_liked_by_me ? "fill-red-500" : ""}/>
                    {post.likes_count}
                </button>
                <button onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 font-bold text-sm transition-all">
                    <MessageCircle size={17}/> {post.comments?.length || 0} Comments
                </button>
            </div>

            {/* Comments */}
            {showComments && (
                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    {(post.comments || []).map(comment => (
                        <div key={comment.id} className="flex gap-3 bg-gray-50 dark:bg-gray-800 p-3.5 rounded-2xl">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                {comment.author_initial}
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 dark:text-white text-sm">{comment.author_name}</h5>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-0.5">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoggedIn && (
                        <div className="flex gap-3 mt-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">
                                {currentUser?.initial}
                            </div>
                            <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-800 focus-within:border-blue-400 transition-all">
                                <input
                                    type="text" value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full bg-transparent outline-none text-sm font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                                    onKeyDown={e => { if (e.key === 'Enter') submitComment(); }}
                                />
                                <button onClick={submitComment} disabled={!commentText.trim()} className="text-blue-600 disabled:text-gray-300 dark:disabled:text-gray-600 p-1 shrink-0">
                                    <Send size={15}/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
