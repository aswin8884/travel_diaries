import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Compass, LogIn, UserCircle, LogOut, Briefcase } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Core State: Is the user logged in?
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Check local storage for the access token whenever the page changes
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [location]); // Re-run whenever the URL changes

    const handleLogout = () => {
        // Clear tokens from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        navigate('/'); // Redirect to homepage after logout
    };

    // Define navigation links
    const navLinks = [
        { name: 'Discover', path: '/', icon: MapPin },
        { name: 'Community', path: '/community', icon: Compass },
        { name: 'My Trips', path: '/my-trips', icon: Briefcase },
    ];

    return (
        <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-gray-950 font-black text-2xl tracking-tighter flex items-center gap-2">
                <MapPin className="text-blue-600" fill="currentColor" size={24}/> TravelApp.
            </Link>

            {/* Main Navigation (Premium centered pill design) */}
            <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1.5 rounded-full border border-gray-100 shadow-inner">
                {navLinks.map((link) => (
                    <Link 
                        key={link.name}
                        to={link.path}
                        className={`px-6 py-2.5 rounded-full flex items-center gap-2.5 font-bold transition-all ${location.pathname === link.path ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-950'}`}
                    >
                        <link.icon size={18} /> {link.name}
                    </Link>
                ))}
            </div>

            {/* User Auth Section (The dynamic part!) */}
            <div className="flex items-center gap-2">
                {!isLoggedIn ? (
                    // IF LOGGED OUT: Show Login and Get Started
                    <>
                        <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 text-blue-600 font-bold hover:bg-blue-50 rounded-full transition-colors">
                            <LogIn size={20} /> Sign In
                        </Link>
                        <Link to="/register" className="bg-gray-950 text-white px-7 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-colors">
                            Get Started
                        </Link>
                    </>
                ) : (
                    // IF LOGGED IN: Show Profile Icon and Logout
                    <div className="flex items-center gap-2">
                    <Link to="/account" className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors">
                            <UserCircle size={20} /> My Account
                    </Link>
                        <button onClick={handleLogout} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 font-bold">
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;