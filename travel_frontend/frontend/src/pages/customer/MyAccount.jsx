import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, Save, Camera, Phone, MapPin, LoaderCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const MyAccount = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    
    // State matches database fields exactly
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '', 
        username: '',
        phone_number: '', 
        address: '' 
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/users/me/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Populate state with real database data
                setUser({
                    first_name: res.data.first_name || '',
                    last_name: res.data.last_name || '',
                    email: res.data.email || '', 
                    username: res.data.username || '',
                    phone_number: res.data.phone_number || '',
                    address: res.data.address || ''
                });
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setFetchError(true); // Show an error message if Django crashes
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.patch('http://localhost:8000/api/users/me/', {
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                address: user.address
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile successfully updated in the database!");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Check your Django terminal for errors.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        if(window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/');
            window.location.reload(); 
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 gap-2">
                <LoaderCircle className="animate-spin" size={20} /> Loading Profile...
            </div>
        );
    }
    const displayLetter = user.first_name ? user.first_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');
    const displayName = (user.first_name || user.last_name) ? `${user.first_name} ${user.last_name}` : (user.email || 'Anonymous Traveler');

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                
                <div className="mb-10 animate-in slide-in-from-top-4 duration-500">
                    <h1 className="text-3xl font-black text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your personal information and security.</p>
                </div>

                {fetchError && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 font-bold">
                        <AlertTriangle size={20} />
                        Could not connect to the database. Make sure your Django server is running!
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                            
                            <div className="relative z-10 mx-auto w-24 h-24 bg-white rounded-full p-1.5 mb-4 mt-6 shadow-lg">
                                <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-500 relative group cursor-pointer">
                                    <span className="text-4xl font-black uppercase">
                                        {displayLetter}
                                    </span>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-black text-gray-900 truncate px-2">
                                {displayName}
                            </h2>
                            <p className="text-gray-500 text-sm font-medium mb-6 truncate">{user.email || 'No email found'}</p>
                            
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold mb-6 border border-green-100">
                                <Shield size={14} /> Verified Traveler
                            </div>

                            <button onClick={handleLogout} className="w-full py-3.5 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-colors">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 animate-in fade-in duration-500">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <User className="text-blue-500"/> Personal Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <input type="text" value={user.first_name} onChange={(e) => setUser({...user, first_name: e.target.value})} placeholder="Add your first name" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <input type="text" value={user.last_name} onChange={(e) => setUser({...user, last_name: e.target.value})} placeholder="Add your last name" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                                        <Mail size={16}/> Email Address (Fixed)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none"><Mail className="text-gray-400" size={18} /></div>
                                        <input 
                                            type="email" 
                                            value={user.email || ''} 
                                            readOnly 
                                            placeholder="Your registered email will appear here"
                                            className="w-full pl-12 pr-5 py-4 bg-gray-100 text-gray-400 border border-gray-100 rounded-2xl outline-none font-medium cursor-not-allowed select-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 font-medium">Your login email cannot be changed from this profile page.</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Phone className="text-blue-500"/> Contact & Address
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none"><Phone className="text-gray-400" size={18} /></div>
                                        <input type="tel" value={user.phone_number} onChange={(e) => setUser({...user, phone_number: e.target.value})} placeholder="Add your phone number" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Home Address</label>
                                    <div className="relative">
                                        <div className="absolute top-4 left-5 pointer-events-none"><MapPin className="text-gray-400" size={18} /></div>
                                        <textarea value={user.address} onChange={(e) => setUser({...user, address: e.target.value})} rows="3" placeholder="Add your address" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none text-lg"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end">
                                <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:translate-y-0">
                                    {isSaving ? 'Saving to Database...' : <><Save size={20} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyAccount;