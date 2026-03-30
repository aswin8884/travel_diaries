import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, ArrowLeft, Building, Utensils, Calendar, Phone, Mail } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!bookingData) navigate('/');
    }, [bookingData, navigate]);

    if (!bookingData) return null;

    const { type, item, total, checkIn, checkOut, days } = bookingData;

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        setTimeout(() => {
            const newBooking = {
                id: Date.now(),
                type,
                item,
                total,
                checkIn,
                checkOut,
                days,
                bookingDate: new Date().toLocaleDateString()
            };
            
            const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
            localStorage.setItem('user_bookings', JSON.stringify([newBooking, ...existingBookings]));
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => { navigate('/my-trips'); }, 3000);

        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
                <p className="text-xl text-gray-500 font-medium max-w-md mb-4">
                    Your {type === 'hotel' ? 'stay at' : 'reservation at'} <span className="text-gray-900 font-bold">{item.name}</span> is confirmed. 
                </p>
                <p className="text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-lg">A confirmation email has been sent to {email}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors"><ArrowLeft size={18}/> Back</button>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-3/5">
                        <h2 className="text-3xl font-black text-gray-900 mb-8">Secure Checkout</h2>
                        
                        <form onSubmit={handlePayment} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">1. Contact Information</h3>
                            <div className="space-y-6 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none"><Mail className="text-gray-400" size={18} /></div>
                                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none"><Phone className="text-gray-400" size={18} /></div>
                                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">2. Payment Details</h3>
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg w-max font-bold text-sm mb-6"><ShieldCheck size={18} /> SSL Encrypted Dummy Gateway</div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none"><CreditCard className="text-gray-400" size={20} /></div>
                                        <input type="text" required maxLength="19" placeholder="0000 0000 0000 0000" className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg tracking-widest" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Expiry</label>
                                        <input type="text" required maxLength="5" placeholder="MM/YY" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 text-center font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                                        <input type="password" required maxLength="3" placeholder="•••" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-400 text-center tracking-widest font-medium" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isProcessing} className="w-full mt-10 py-5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-xl">
                                {isProcessing ? <span className="animate-pulse">Processing Booking & Emailing...</span> : <>Confirm & Pay ₹{total}</>}
                            </button>
                        </form>
                    </div>
                    <div className="lg:w-2/5">
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl sticky top-32">
                            <h3 className="text-xl font-bold mb-6 text-gray-400 uppercase tracking-widest">Order Summary</h3>
                            <div className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-700">
                                <div className={`p-4 rounded-2xl ${type === 'hotel' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                    {type === 'hotel' ? <Building size={32}/> : <Utensils size={32}/>}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black mb-1">{item.name}</h4>
                                    <p className="text-gray-400 font-medium text-sm line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                            {type === 'hotel' && (
                                <div className="space-y-4 mb-8 pb-8 border-b border-gray-700">
                                    <div className="flex justify-between items-center text-gray-300 font-medium"><span className="flex items-center gap-2"><Calendar size={16}/> Check-in</span><span className="text-white font-bold">{checkIn}</span></div>
                                    <div className="flex justify-between items-center text-gray-300 font-medium"><span className="flex items-center gap-2"><Calendar size={16}/> Check-out</span><span className="text-white font-bold">{checkOut}</span></div>
                                    <div className="flex justify-between items-center text-gray-300 font-medium"><span>Duration</span><span className="text-white font-bold">{days} Nights</span></div>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-xl font-bold">Total</span>
                                <span className="text-4xl font-black text-white">₹{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;