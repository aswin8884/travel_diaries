import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, CalendarCheck, Users, MapPin, LogOut, Building, Utensils } from 'lucide-react';
import axios from 'axios';

// Import our modular components
import OverviewTab from "./OverviewTab.jsx";
import DestinationsTab from "./DestinationsTab.jsx";
import UsersTab from "./UsersTab.jsx";
import HotelsTab from "./HotelsTab.jsx";
import RestaurantsTab from "./RestaurantsTab.jsx";

const AdminDashboard = () => {
    const navigate = useNavigate(); 
    
    const [activeTab, setActiveTab] = useState('destinations');
    const [destinations, setDestinations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDest, setSelectedDest] = useState(null); 
    const [isModalActive, setIsModalActive] = useState(false); 

    const openModal = (dest) => {
        setSelectedDest(dest);
        setIsModalActive(true); 
    };

    const closeModal = () => {
        setIsModalActive(false); 
        setTimeout(() => { setSelectedDest(null); }, 300);
    };

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
                const destRes = await axios.get('http://localhost:8000/api/destinations/', config);
                setDestinations(destRes.data.results || destRes.data);
            } catch (e) { console.error(e); }

            try {
                const usersRes = await axios.get('http://localhost:8000/api/users/all/', config);
                setUsers(usersRes.data.results || usersRes.data);
            } catch (e) { console.error(e); } 
            
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen font-medium text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50/30 pb-20">
            
            {/* ADMIN NAVBAR */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-[80] px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-950 font-black text-xl tracking-tighter flex items-center gap-2">
                        <MapPin className="text-blue-600" fill="currentColor" size={22}/> TravelApp.
                    </Link>
                    <div className="hidden md:block w-px h-6 bg-gray-200"></div>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Admin</span>
                        <h2 className="text-gray-500 font-bold text-sm uppercase tracking-widest">Dashboard</h2>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex items-center gap-2.5 bg-green-50 px-3.5 py-1.5 rounded-full border border-green-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-700 text-xs font-bold uppercase tracking-wide">System Online</span>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                        <LogOut size={18} /> <span className="hidden sm:block">Logout</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto space-y-8 relative px-6 mt-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Command Center</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage platform revenue, bookings, and global destinations.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <Link to="/admin/add-hotel" className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-5 py-3.5 rounded-2xl font-bold shadow-sm transition-all hover:-translate-y-0.5">
                            <Building size={18} /> Add Hotel
                        </Link>
                        <Link to="/admin/add-restaurant" className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-5 py-3.5 rounded-2xl font-bold shadow-sm transition-all hover:-translate-y-0.5">
                            <Utensils size={18} /> Add Restaurant
                        </Link>
                        <Link to="/admin/add-destination" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5">
                            <Plus size={18} /> Add Destination
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
  <div className="flex overflow-x-auto hide-scrollbar gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 shadow-sm inline-flex w-full md:w-auto">
    <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}><LayoutDashboard size={18} /> Overview</button>
    <button onClick={() => setActiveTab('destinations')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'destinations' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}><MapPin size={18} /> Destinations</button>
    
    {/* NEW TABS HERE! */}
    <button onClick={() => setActiveTab('hotels')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'hotels' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}><Building size={18} /> Hotels</button>
    <button onClick={() => setActiveTab('restaurants')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'restaurants' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}><Utensils size={18} /> Restaurants</button>
    
    <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}><Users size={18} /> Users</button>
    <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}><CalendarCheck size={18} /> Bookings</button>
</div>

                {/* TAB CONTENT */}
                {activeTab === 'overview' && <OverviewTab destinationsCount={destinations.length} usersCount={users.length} />}
                
                {activeTab === 'destinations' && (
                    <DestinationsTab 
                        destinations={destinations} 
                        setDestinations={setDestinations} 
                        selectedDest={selectedDest} 
                        openModal={openModal} 
                        closeModal={closeModal} 
                        isModalActive={isModalActive} 
                    />
                )}
                
                {activeTab === 'users' && <UsersTab users={users} />}

                {activeTab === 'hotels' && <HotelsTab destinations={destinations} />}
{activeTab === 'restaurants' && <RestaurantsTab destinations={destinations} />}
                
                {activeTab === 'bookings' && (
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-sm p-12 text-center animate-in fade-in duration-500">
                        <CalendarCheck size={32} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Manage Bookings</h3>
                        <p className="text-gray-500 mt-2">Booking API integration coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;