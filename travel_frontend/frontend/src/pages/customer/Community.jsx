import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users } from 'lucide-react';
import axios from 'axios';
import CreatePost from '../../components/community/CreatePost';
import PostCard from '../../components/community/PostCard';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [destinations, setDestinations] = useState([]);

    const fetchPosts = async () => {
        const token = localStorage.getItem('access_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
            const res = await axios.get('http://localhost:8000/api/community/', { headers });
            setPosts(res.data.results || res.data);
        } catch (e) { console.error("Failed to fetch posts", e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
        if (token) {
            axios.get('http://localhost:8000/api/users/me/', { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    const name = res.data.first_name || res.data.username || res.data.email.split('@')[0];
                    setCurrentUser({ name, initial: name.charAt(0).toUpperCase() });
                }).catch(console.error);
        }
        fetchPosts();
        // Fetch destinations for the optional "tag a destination" dropdown in CreatePost.
        axios.get('http://localhost:8000/api/destinations/')
            .then(res => setDestinations(res.data.results || res.data))
            .catch(console.error);
    }, []);

    const handleCreatePost = async (formData) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/community/', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            fetchPosts();
        } catch { alert("Failed to create post."); }
    };

    const handleLike = async (postId) => {
        if (!isLoggedIn) return alert("Sign in to like posts.");
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://localhost:8000/api/community/${postId}/toggle_like/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchPosts();
        } catch (e) { console.error(e); }
    };

    const handleComment = async (postId, text) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://localhost:8000/api/community/${postId}/add_comment/`, { text }, { headers: { Authorization: `Bearer ${token}` } });
            fetchPosts();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl mx-auto mb-4 shadow-lg shadow-blue-500/20">
                        <Compass className="text-white" size={26}/>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Traveler Community</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Share memories, leave feedback, and discover hidden gems.</p>
                </div>

                {isLoggedIn ? (
                    <CreatePost currentUser={currentUser} onPostSubmit={handleCreatePost} destinations={destinations} />
                ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border border-blue-100 dark:border-blue-900/50 p-8 rounded-3xl text-center mb-8">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Users className="text-blue-600 dark:text-blue-400" size={22}/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Want to share your experience?</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium text-sm">Join the community to post memories, upload photos, and connect with travelers.</p>
                        <Link to="/login" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                            Sign In to Join
                        </Link>
                    </div>
                )}

                {/* Posts */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {posts.length === 0 && (
                            <div className="text-center py-16 text-gray-400 dark:text-gray-600 font-bold">
                                <Compass size={48} className="mx-auto mb-3 opacity-30"/>
                                No posts yet. Be the first to share!
                            </div>
                        )}
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} currentUser={currentUser} isLoggedIn={isLoggedIn} onLike={handleLike} onComment={handleComment}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
