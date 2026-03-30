import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ShieldCheck, User } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [loginRole, setLoginRole] = useState('customer'); // The Toggle State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/users/login/', {
                username: email,
                password
            });
            
            const accessToken = response.data.access;
            const decoded = jwtDecode(accessToken);
            
            // Security Check: Did they toggle Admin but log in with a Customer account?
            if (loginRole === 'admin' && decoded.role !== 'admin') {
                setError("Access denied. This account lacks Administrator privileges.");
                return;
            }

            localStorage.setItem('refresh_token', response.data.refresh);
            login(accessToken);
            
            navigate(decoded.role === 'admin' ? '/admin' : '/');
            
        } catch (err) {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Abstract Shapes for Glassmorphism to blur */}
            <div className="absolute top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>

            {/* Glassmorphic Card */}
            <div className="relative w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                <h2 className="text-3xl font-black text-center text-gray-800 mb-6 tracking-tight">Welcome Back</h2>
                
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm text-center p-3 rounded-xl mb-6 font-medium">{error}</div>}

                {/* Modern Toggle */}
                <div className="flex bg-white/50 p-1 rounded-2xl mb-6 shadow-inner border border-white/40">
                    <button type="button" onClick={() => setLoginRole('customer')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all duration-300 ${loginRole === 'customer' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        <User size={18} /> Customer
                    </button>
                    <button type="button" onClick={() => setLoginRole('admin')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all duration-300 ${loginRole === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        <ShieldCheck size={18} /> Admin
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="email" required className="w-full pl-11 pr-4 py-3 bg-white/50 border border-white/60 focus:border-blue-400 focus:bg-white/80 rounded-2xl outline-none transition-all shadow-sm backdrop-blur-sm" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="password" required className="w-full pl-11 pr-4 py-3 bg-white/50 border border-white/60 focus:border-blue-400 focus:bg-white/80 rounded-2xl outline-none transition-all shadow-sm backdrop-blur-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-2">
                        Sign In {loginRole === 'admin' && 'as Admin'}
                    </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-8 font-medium">Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline">Sign up</Link></p>
            </div>
        </div>
    );
};
export default Login;