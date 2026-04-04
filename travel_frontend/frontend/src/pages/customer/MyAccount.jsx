import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, Save, Camera, Phone, MapPin, LoaderCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { isValidPhone } from '../../utils/validate';

const inputCls = "w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-750 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium";
const inputWithIconCls = "w-full pl-12 pr-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl outline-none focus:bg-white dark:focus:bg-gray-750 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium";
const labelCls = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5";

const MyAccount = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [saved, setSaved] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [user, setUser] = useState({ first_name: '', last_name: '', email: '', username: '', phone_number: '', address: '' });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) { navigate('/login'); return; }
        axios.get('http://localhost:8000/api/users/me/', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setUser({
                first_name: res.data.first_name || '',
                last_name: res.data.last_name || '',
                email: res.data.email || '',
                username: res.data.username || '',
                phone_number: res.data.phone_number || '',
                address: res.data.address || ''
            }))
            .catch(err => {
                setFetchError(true);
                if (err.response?.status === 401) { localStorage.removeItem('access_token'); navigate('/login'); }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (user.phone_number && !isValidPhone(user.phone_number)) {
            setPhoneError('Enter a valid 10-digit Indian phone number (starting with 6-9).');
            return;
        }
        setPhoneError('');
        setIsSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.patch('http://localhost:8000/api/users/me/', {
                first_name: user.first_name, last_name: user.last_name,
                phone_number: user.phone_number, address: user.address
            }, { headers: { Authorization: `Bearer ${token}` } });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            alert("Failed to update profile.");
        } finally { setIsSaving(false); }
    };

    const handleLogout = () => {
        if (window.confirm("Sign out?")) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/');
            window.location.reload();
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-bold">
                <LoaderCircle className="animate-spin" size={20}/> Loading Profile...
            </div>
        </div>
    );

    const displayLetter = (user.first_name || user.email || '?').charAt(0).toUpperCase();
    const displayName = user.first_name ? `${user.first_name} ${user.last_name}`.trim() : (user.email || 'Traveler');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage your personal information and security.</p>
                </div>

                {fetchError && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 font-bold">
                        <AlertTriangle size={18}/> Could not connect to server. Make sure Django is running.
                    </div>
                )}

                {saved && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 rounded-2xl flex items-center gap-3 font-bold">
                        Profile saved successfully!
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Card */}
                    <div className="md:w-72 shrink-0">
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm text-center">
                            <div className="h-20 bg-gradient-to-r from-blue-600 to-violet-600"></div>
                            <div className="px-6 pb-6 -mt-10">
                                <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full p-1.5 mx-auto shadow-lg">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50 rounded-full flex items-center justify-center relative group cursor-pointer">
                                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400 uppercase">{displayLetter}</span>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={18} className="text-white"/>
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-white mt-3 truncate">{displayName}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4 truncate">{user.email}</p>
                                <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-green-100 dark:border-green-900 mb-5">
                                    <Shield size={13}/> Verified Traveler
                                </div>
                                <button onClick={handleLogout} className="w-full py-3 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white rounded-2xl font-bold transition-all">
                                    <LogOut size={16}/> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="flex-1">
                        <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-7 shadow-sm space-y-7">
                            {/* Personal */}
                            <div>
                                <h3 className="text-base font-black text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                    <User size={17} className="text-blue-500"/> Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>First Name</label>
                                        <input type="text" value={user.first_name} onChange={e => setUser({...user, first_name: e.target.value})} placeholder="First name" className={inputCls}/>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Last Name</label>
                                        <input type="text" value={user.last_name} onChange={e => setUser({...user, last_name: e.target.value})} placeholder="Last name" className={inputCls}/>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-500 mb-1.5 flex items-center gap-1.5"><Mail size={14}/> Email (Read-only)</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"/>
                                            <input type="email" value={user.email} readOnly className="w-full pl-11 pr-5 py-3.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-2xl outline-none cursor-not-allowed font-medium"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="text-base font-black text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                    <Phone size={17} className="text-blue-500"/> Contact & Address
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelCls}>Phone Number</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"/>
                                            <input type="tel" value={user.phone_number} onChange={e => { setUser({...user, phone_number: e.target.value}); setPhoneError(''); }} onBlur={() => { if (user.phone_number && !isValidPhone(user.phone_number)) setPhoneError('Enter a valid 10-digit Indian phone number (starting with 6-9).'); }} placeholder="Your phone number" className={`${inputWithIconCls}${phoneError ? ' border-red-400 dark:border-red-600' : ''}`}/>
                                        </div>
                                        {phoneError && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">{phoneError}</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Home Address</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-4 top-4 text-gray-400 dark:text-gray-500"/>
                                            <textarea value={user.address} onChange={e => setUser({...user, address: e.target.value})} rows="3" placeholder="Your address" className={`${inputWithIconCls} resize-none`}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0">
                                    {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</> : <><Save size={17}/> Save Changes</>}
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
