import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:8000/api/users/register/', {
                first_name: formData.name, email: formData.email, password: formData.password, role: formData.role
            });
            alert("Registration Successful! Please sign in.");
            navigate('/login');
        } catch (err) {
            setError("Registration failed. Email might be in use.");
        }
    };

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            <div className="absolute top-10 -right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
            <div className="absolute -bottom-8 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
            <div className="relative w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                <h2 className="text-3xl font-black text-center text-gray-800 mb-8 tracking-tight">Create Account</h2>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm text-center p-3 rounded-xl mb-6 font-medium">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="text" required className="w-full pl-11 pr-4 py-3 bg-white/50 border border-white/60 focus:border-blue-400 focus:bg-white/80 rounded-2xl outline-none transition-all shadow-sm backdrop-blur-sm" placeholder="John Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="email" required className="w-full pl-11 pr-4 py-3 bg-white/50 border border-white/60 focus:border-blue-400 focus:bg-white/80 rounded-2xl outline-none transition-all shadow-sm backdrop-blur-sm" placeholder="you@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="password" required minLength="6" className="w-full pl-11 pr-4 py-3 bg-white/50 border border-white/60 focus:border-blue-400 focus:bg-white/80 rounded-2xl outline-none transition-all shadow-sm backdrop-blur-sm" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-2">
                        Join TravelApp
                    </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-8 font-medium">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline">Sign in</Link></p>
            </div>
        </div>
    );
};
export default Register;