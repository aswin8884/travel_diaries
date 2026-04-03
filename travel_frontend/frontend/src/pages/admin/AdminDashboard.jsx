import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, CalendarCheck, Users, MapPin, LogOut, Building, Utensils, Compass, Sun, Moon, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext.jsx';

import OverviewTab from "./views/OverviewTab.jsx";
import DestinationsTab from "./destinations/DestinationsTab.jsx";
import UsersTab from "./views/UsersTab.jsx";
import HotelsTab from "./hotels/HotelsTab.jsx";
import RestaurantsTab from "./restaurants/RestaurantsTab.jsx";
import BookingsTab from "./bookings/BookingsTab.jsx";

const TABS = [
    { id: 'overview',      icon: LayoutDashboard, label: 'Overview' },
    { id: 'destinations',  icon: MapPin,           label: 'Destinations' },
    { id: 'hotels',        icon: Building,         label: 'Hotels' },
    { id: 'restaurants',   icon: Utensils,         label: 'Restaurants' },
    { id: 'users',         icon: Users,            label: 'Users' },
    { id: 'bookings',      icon: CalendarCheck,    label: 'Bookings' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isDark, toggle } = useTheme();

    const [activeTab, setActiveTab] = useState('overview');
    const [destinations, setDestinations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDest, setSelectedDest] = useState(null);
    const [isModalActive, setIsModalActive] = useState(false);

    const openModal = (dest) => { setSelectedDest(dest); setIsModalActive(true); };
    const closeModal = () => { setIsModalActive(false); setTimeout(() => setSelectedDest(null), 300); };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const [destRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/destinations/', config),
                    axios.get('http://localhost:8000/api/users/all/', config),
                ]);
                setDestinations(destRes.data.results || destRes.data);
                setUsers(usersRes.data.results || usersRes.data);
            } catch (e) {
                console.error("Dashboard data fetch error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 font-bold animate-pulse">Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* ===== TOP NAVBAR ===== */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-[80] px-6 py-4">
                <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Compass className="text-white" size={17} strokeWidth={2.5}/>
                            </div>
                            <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight">Travel<span className="text-blue-600">Dairies</span></span>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 ml-4">
                            <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">Admin</span>
                            <span className="text-gray-400 dark:text-gray-500 font-bold text-sm">Command Center</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">System Online</span>
                        </div>
                        <button onClick={toggle} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all hover:scale-110">
                            {isDark ? <Sun size={17} className="text-yellow-400"/> : <Moon size={17} className="text-slate-600"/>}
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl">
                            <LogOut size={17}/> <span className="hidden sm:block text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-6">

                {/* ===== QUICK ACTION HEADER ===== */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Command Center</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-0.5">Manage destinations, bookings, and platform analytics.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link to="/admin/add-hotel" className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5">
                            <Building size={16}/> Add Hotel
                        </Link>
                        <Link to="/admin/add-restaurant" className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5">
                            <Utensils size={16}/> Add Restaurant
                        </Link>
                        <Link to="/admin/add-destination" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40">
                            <Plus size={16}/> New Destination
                        </Link>
                    </div>
                </div>

                {/* ===== TAB NAVIGATION ===== */}
                <div className="flex overflow-x-auto hide-scrollbar gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1.5 rounded-2xl shadow-sm w-full">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm flex-1 justify-center
                                ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <tab.icon size={16}/> {tab.label}
                        </button>
                    ))}
                </div>

                {/* ===== BREADCRUMB ===== */}
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-600">
                    <span>Admin</span>
                    <ChevronRight size={12}/>
                    <span className="text-gray-700 dark:text-gray-300">{TABS.find(t => t.id === activeTab)?.label}</span>
                </div>

                {/* ===== TAB CONTENT ===== */}
                <div>
                    {activeTab === 'overview' && <OverviewTab destinationsCount={destinations.length} usersCount={users.length} />}
                    {activeTab === 'destinations' && <DestinationsTab destinations={destinations} setDestinations={setDestinations} selectedDest={selectedDest} openModal={openModal} closeModal={closeModal} isModalActive={isModalActive} />}
                    {activeTab === 'users' && <UsersTab users={users} />}
                    {activeTab === 'hotels' && <HotelsTab destinations={destinations} />}
                    {activeTab === 'restaurants' && <RestaurantsTab destinations={destinations} />}
                    {activeTab === 'bookings' && <BookingsTab />}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
