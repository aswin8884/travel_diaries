import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Compass } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/users/register/', {
                first_name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'customer'
            });
            alert("Account created! Please sign in.");
            navigate('/login');
        } catch {
            setError("Registration failed. This email may already be in use.");
            setLoading(false);
        }
    };

    const inputCls = "w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium";

    return (
        <div className="min-h-[calc(100vh-96px)] bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="fixed top-20 -right-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed bottom-0 -left-20 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
                        <Compass className="text-white" size={26}/>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create account</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Join the Travel Dairies community</p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-black/30">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm text-center p-3.5 rounded-2xl mb-6 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"/>
                                <input type="text" required placeholder="John Doe" onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls}/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"/>
                                <input type="email" required placeholder="you@example.com" onChange={e => setFormData({...formData, email: e.target.value})} className={inputCls}/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"/>
                                <input type="password" required minLength="6" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} className={inputCls}/>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Creating...</> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6 font-medium">
                        Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
