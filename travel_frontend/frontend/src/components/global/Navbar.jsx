import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, LogIn, UserCircle, LogOut, Globe, Briefcase } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Core State: Single source of truth for authentication
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Check local storage for the access token whenever the page (URL) changes
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, [location.pathname]);

    const handleLogout = () => {
        // Clear tokens from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        navigate('/'); // Redirect to homepage after logout
    };

    return (
        <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center">
            
            {/* 1. Logo */}
            <Link to="/" className="text-gray-950 font-black text-2xl tracking-tighter flex items-center gap-2">
                <MapPin className="text-blue-600" fill="currentColor" size={24}/> Travel Dairies.
            </Link>

            {/* 2. Main Navigation (Unified & Dynamic) */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-100 shadow-inner">
                
                <Link to="/" className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${location.pathname === '/' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-950 hover:bg-white/50'}`}>
                    <MapPin size={16} /> Discover
                </Link>
                
                <Link to="/community" className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${location.pathname === '/community' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-950 hover:bg-white/50'}`}>
                    <Globe size={16} /> Community
                </Link>

                {/* 🔥 Hides from Guests, Active State applies when clicked 🔥 */}
                {isLoggedIn && (
                    <Link to="/my-trips" className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${location.pathname === '/my-trips' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-950 hover:bg-white/50'}`}>
                        <Briefcase size={16} /> My Trips
                    </Link>
                )}
            </div>

            {/* 3. User Auth Section */}
            <div className="flex items-center gap-2">
                {!isLoggedIn ? (
                    // IF LOGGED OUT: Show Login and Get Started
                    <>
                        <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 text-blue-600 font-bold hover:bg-blue-50 rounded-full transition-colors">
                            <LogIn size={20} /> Sign In
                        </Link>
                        <Link to="/register" className="bg-gray-950 text-white px-7 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-colors hidden sm:block">
                            Get Started
                        </Link>
                    </>
                ) : (
                    // IF LOGGED IN: Show Profile Icon and Logout
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-gray-900 font-bold hover:bg-gray-50 rounded-full transition-colors">
                            <UserCircle size={20} /> <span className="hidden sm:block">My Account</span>
                        </Link>
                        <button onClick={handleLogout} className="p-2 sm:px-4 sm:py-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 font-bold">
                            <LogOut size={20} /> <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;