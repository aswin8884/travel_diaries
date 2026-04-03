import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ShieldCheck, User, Compass } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loginRole, setLoginRole] = useState('customer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/users/login/', { username: email, password });
            const accessToken = response.data.access;
            const decoded = jwtDecode(accessToken);
            if (loginRole === 'admin' && decoded.role !== 'admin') {
                setError("Access denied. This account lacks Administrator privileges.");
                setLoading(false);
                return;
            }
            localStorage.setItem('refresh_token', response.data.refresh);
            login(accessToken);
            navigate(decoded.role === 'admin' ? '/admin' : '/');
        } catch {
            setError('Invalid email or password. Please try again.');
            setLoading(false);
        }
    };

    const inputCls = "w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium";

    return (
        <div className="min-h-[calc(100vh-96px)] bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
            {/* Background blobs */}
            <div className="fixed top-20 -left-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed top-20 -right-20 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
                        <Compass className="text-white" size={26}/>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Sign in to your Travel Dairies account</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-black/30">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm text-center p-3.5 rounded-2xl mb-6 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Role toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl mb-6">
                        <button type="button" onClick={() => setLoginRole('customer')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                            ${loginRole === 'customer' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            <User size={16}/> Customer
                        </button>
                        <button type="button" onClick={() => setLoginRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                            ${loginRole === 'admin' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            <ShieldCheck size={16}/> Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"/>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls}/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"/>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls}/>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 mt-2">
                            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Signing in...</> : `Sign In${loginRole === 'admin' ? ' as Admin' : ''}`}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6 font-medium">
                        Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
