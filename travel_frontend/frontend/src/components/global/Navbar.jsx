import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, LogIn, UserCircle, LogOut, Globe, Briefcase, Compass, Menu, X, Sun, Moon, Bell } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext.jsx';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggle } = useTheme();

    const isLoggedIn = !!localStorage.getItem('access_token');
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Fetch notifications when logged in.
    useEffect(() => {
        if (!isLoggedIn) return;
        const token = localStorage.getItem('access_token');
        axios.get('http://localhost:8000/api/notifications/', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setNotifications(res.data.results || res.data))
            .catch(() => {});
    }, [isLoggedIn, location.pathname]);

    // Close notification panel on outside click.
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAllRead = async () => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('http://localhost:8000/api/notifications/mark_all_read/', {}, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (e) { void e; /* silently ignore — UI already reflects optimistic state */ }
    };

    const markOneRead = async (id) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.post(`http://localhost:8000/api/notifications/${id}/mark_read/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (e) { void e; }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setMobileOpen(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 px-6 py-4 flex justify-between items-center
                ${scrolled
                    ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 border-b border-gray-200/60 dark:border-gray-800/60'
                    : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-transparent'
                }`}>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                        <Compass className="text-white" size={18} strokeWidth={2.5}/>
                    </div>
                    <span className="text-gray-950 dark:text-white font-black text-xl tracking-tight">
                        Travel<span className="text-blue-600">Dairies</span>
                    </span>
                </Link>

                {/* Desktop Nav Pills */}
                <div className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 p-1.5 rounded-2xl shadow-inner backdrop-blur-sm">
                    <Link to="/" className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all duration-200
                        ${isActive('/') ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-white/70 dark:hover:bg-gray-800/70'}`}>
                        <MapPin size={15}/> Discover
                    </Link>
                    <Link to="/community" className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all duration-200
                        ${isActive('/community') ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-white/70 dark:hover:bg-gray-800/70'}`}>
                        <Globe size={15}/> Community
                    </Link>
                    {isLoggedIn && (
                        <Link to="/my-trips" className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all duration-200
                            ${isActive('/my-trips') ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-white/70 dark:hover:bg-gray-800/70'}`}>
                            <Briefcase size={15}/> My Trips
                        </Link>
                    )}
                </div>

                {/* Desktop Right: Auth + Theme + Notifications */}
                <div className="hidden md:flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggle}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-110"
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-slate-600"/>}
                    </button>

                    {/* Notification Bell — only when logged in */}
                    {isLoggedIn && (
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) markAllRead(); }}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 relative"
                                title="Inbox"
                            >
                                <Bell size={18}/>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {notifOpen && (
                                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                        <h4 className="font-black text-gray-900 dark:text-white text-sm">Inbox</h4>
                                        {notifications.length > 0 && (
                                            <button onClick={markAllRead} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="py-10 text-center text-gray-400 dark:text-gray-600 font-bold text-sm">
                                                <Bell size={28} className="mx-auto mb-2 opacity-30"/>
                                                No notifications yet
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <button
                                                    key={n.id}
                                                    onClick={() => markOneRead(n.id)}
                                                    className={`w-full text-left px-5 py-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {!n.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>}
                                                        <div className={!n.is_read ? '' : 'pl-5'}>
                                                            <p className="font-black text-gray-900 dark:text-white text-xs leading-tight mb-1">{n.title}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed whitespace-pre-line">{n.message}</p>
                                                            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-bold mt-1">
                                                                {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all duration-200">
                                <LogIn size={17}/> Sign In
                            </Link>
                            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                                    <UserCircle size={16} className="text-white"/>
                                </div>
                                <span className="hidden lg:block">My Account</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200">
                                <LogOut size={17}/> <span className="hidden lg:block">Logout</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile: theme + hamburger */}
                <div className="md:hidden flex items-center gap-2">
                    <button onClick={toggle} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all">
                        {isDark ? <Sun size={16} className="text-yellow-400"/> : <Moon size={16}/>}
                    </button>
                    {isLoggedIn && unreadCount > 0 && (
                        <div className="relative">
                            <button onClick={() => setNotifOpen(!notifOpen)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all relative">
                                <Bell size={16}/>
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{unreadCount}</span>
                            </button>
                        </div>
                    )}
                    <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                        onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[99] pt-20 bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl md:hidden">
                    <div className="flex flex-col gap-2 px-6 py-4">
                        <Link to="/" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-base transition-all ${isActive('/') ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                            <MapPin size={18}/> Discover
                        </Link>
                        <Link to="/community" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-base transition-all ${isActive('/community') ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                            <Globe size={18}/> Community
                        </Link>
                        {isLoggedIn && (
                            <Link to="/my-trips" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-base transition-all ${isActive('/my-trips') ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                                <Briefcase size={18}/> My Trips
                            </Link>
                        )}
                        <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-4">
                            {!isLoggedIn ? (
                                <div className="flex flex-col gap-2">
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <LogIn size={18}/> Sign In
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl font-bold shadow-lg">
                                        Get Started
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <UserCircle size={18}/> My Account
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left">
                                        <LogOut size={18}/> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
