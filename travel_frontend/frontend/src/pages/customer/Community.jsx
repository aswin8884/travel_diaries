import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import axios from 'axios';
import CreatePost from '../../components/community/CreatePost';
import PostCard from '../../components/community/PostCard';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchPosts = async () => {
        const token = localStorage.getItem('access_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
            const res = await axios.get('http://localhost:8000/api/community/', { headers });
            setPosts(res.data.results || res.data);
        } catch (error) { console.error("Failed to fetch posts", error); }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);

        if (token) {
            const fetchUser = async () => {
                try {
                    const res = await axios.get('http://localhost:8000/api/users/me/', { headers: { Authorization: `Bearer ${token}` } });
                    const fullName = (res.data.first_name || res.data.last_name) ? `${res.data.first_name} ${res.data.last_name}` : res.data.username;
                    setCurrentUser({ name: fullName, initial: fullName.charAt(0).toUpperCase() });
                } catch (error) { console.error("User fetch failed", error); }
            };
            fetchUser();
        }
        fetchPosts();
    }, []);

    const handleCreatePost = async (formData) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/community/', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            fetchPosts(); // Reload feed from DB!
        } catch (error) { alert("Failed to create post."); }
    };

    const handleLike = async (postId) => {
        if (!isLoggedIn) return alert("Sign in to like posts.");
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://localhost:8000/api/community/${postId}/toggle_like/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchPosts(); // Refresh likes
        } catch (error) { console.error(error); }
    };

    const handleComment = async (postId, text) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`http://localhost:8000/api/community/${postId}/add_comment/`, { text }, { headers: { Authorization: `Bearer ${token}` } });
            fetchPosts(); // Refresh comments
        } catch (error) { console.error(error); }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-gray-900 flex items-center justify-center gap-3"><Compass className="text-blue-600" size={36}/> Traveler Community</h1>
                    <p className="text-gray-500 font-medium mt-2">Share memories, leave feedback, and discover hidden gems.</p>
                </div>

                {isLoggedIn ? (
                    <CreatePost currentUser={currentUser} onPostSubmit={handleCreatePost} />
                ) : (
                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2rem] text-center mb-10">
                        <h3 className="text-xl font-bold text-blue-900 mb-2">Want to share your experience?</h3>
                        <p className="text-blue-700 mb-6 font-medium text-sm">Join the community to post memories, upload photos, and connect with travelers.</p>
                        <div className="flex justify-center gap-4">
                            <Link to="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700">Sign In</Link>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {posts.length === 0 ? <p className="text-center text-gray-500 font-bold py-10">No posts yet. Be the first to share!</p> : null}
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} currentUser={currentUser} isLoggedIn={isLoggedIn} onLike={handleLike} onComment={handleComment} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community;