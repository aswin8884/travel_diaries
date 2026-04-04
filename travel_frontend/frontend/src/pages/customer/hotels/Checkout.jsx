import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard, Lock, ChevronRight, Info } from 'lucide-react';
import axios from 'axios';
import { isValidName, isValidEmail, isValidPhoneForCountry, phoneHint, isValidCardNumber, isValidExpiry, isValidCVV } from '../../../utils/validate';
import PhoneInput from '../../../components/global/PhoneInput';

const PaypalIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <path d="M7.144 19.532l1.049-5.751c.11-.606.691-1.031 1.304-1.031h4.92c2.437 0 4.156-1.68 4.419-4.01.032-.287.043-.568.034-.842C19.422 5.677 17.7 4 14.862 4H8.119c-.524 0-.978.374-1.074.888L4.001 19.533h3.143z" fill="#009CDE"/>
        <path d="M18.87 8.898c-.252 1.655-1.317 2.942-2.967 3.567-.573.215-1.194.32-1.834.32H9.152l-.963 5.286h-2.91l3.044-16.644h6.743c1.413 0 2.556.403 3.33 1.126C19.155 3.258 19.3 5.946 18.87 8.898z" fill="#012169"/>
    </svg>
);

const RazorpayIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <path d="M12 2L6.343 7.657 12 2z" fill="#072654"/>
        <path d="M12 2l5.657 5.657L12 22 6.343 7.657 12 2z" fill="#3395FF"/>
        <path d="M12 2l5.657 5.657L12 22z" fill="#072654"/>
    </svg>
);

const PAYMENT_METHODS = [
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} />, color: 'blue' },
    { id: 'paypal', label: 'PayPal', icon: <PaypalIcon />, color: 'indigo' },
    { id: 'razorpay', label: 'Razorpay / UPI', icon: <RazorpayIcon />, color: 'sky' },
];

const inputCls = "w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;

    const [step, setStep] = useState(1); // 1=details, 2=payment, 3=processing, 4=success
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [phoneMeta, setPhoneMeta] = useState({ countryCode: 'IN', dialCode: '+91', number: '' });
    const [guestErrors, setGuestErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', holder: '' });
    const [cardErrors, setCardErrors] = useState({});
    const [upiId, setUpiId] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [bookingRef, setBookingRef] = useState('');

    if (!bookingData) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 font-bold text-gray-400">
            No booking data found. Please select a hotel first.
        </div>
    );

    const advancePrice = bookingData.advancePrice ?? Math.round(bookingData.totalPrice * 0.5);
    const balanceDue = bookingData.totalPrice - advancePrice;

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        const errs = {};
        if (!isValidName(formData.name)) errs.name = 'Name must be at least 2 characters.';
        if (!isValidEmail(formData.email)) errs.email = 'Enter a valid email address.';
        if (!isValidPhoneForCountry(phoneMeta.number, phoneMeta.dialCode)) errs.phone = `Enter a valid phone number (${phoneHint(phoneMeta.dialCode)}).`;
        setGuestErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (paymentMethod === 'card') {
            const errs = {};
            if (!isValidCardNumber(cardData.number)) errs.number = 'Enter a valid 16-digit card number.';
            if (!isValidExpiry(cardData.expiry)) errs.expiry = 'Enter a valid future expiry (MM/YY).';
            if (!isValidCVV(cardData.cvv)) errs.cvv = 'Enter a valid 3 or 4-digit CVV.';
            setCardErrors(errs);
            if (Object.keys(errs).length > 0) return;
        }
        setStep(3);

        await new Promise(resolve => setTimeout(resolve, 2200));

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://localhost:8000/api/hotel-bookings/', {
                hotel: bookingData.hotelId,
                check_in: bookingData.checkIn,
                check_out: bookingData.checkOut,
                rooms: bookingData.rooms,
                guest_name: formData.name,
                guest_email: formData.email,
                guest_phone: phoneMeta.dialCode + phoneMeta.number,
                total_price: bookingData.totalPrice,
                advance_price: advancePrice,
            }, { headers: { Authorization: `Bearer ${token}` } });

            setBookingRef(response.data.booking_reference || `HTL-${Math.floor(Math.random() * 1000000)}`);
            setStep(4);
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.non_field_errors?.[0] || error.response?.data?.detail || 'Payment failed. Please try again.';
            alert(errMsg);
            setStep(2);
        }
    };

    const formatCardNumber = (val) => val.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (val) => {
        const clean = val.replace(/\D/g, '').substring(0, 4);
        if (clean.length >= 3) return clean.substring(0, 2) + '/' + clean.substring(2);
        return clean;
    };

    // Step 4: Success
    if (step === 4) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-900 p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center border border-gray-100 dark:border-gray-800">
                    <div className="relative w-28 h-28 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-30"></div>
                        <div className="relative w-28 h-28 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="text-green-500 w-14 h-14" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Booking Confirmed!</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                        Your reservation at <strong className="text-gray-900 dark:text-white">{bookingData.hotelName}</strong> is secured.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 mb-4 text-left">
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Booking Reference</p>
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-wider mb-4">{bookingRef}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                            <div><span className="text-gray-400 dark:text-gray-500 block text-xs uppercase tracking-widest">Check-in</span>{bookingData.checkIn}</div>
                            <div><span className="text-gray-400 dark:text-gray-500 block text-xs uppercase tracking-widest">Check-out</span>{bookingData.checkOut}</div>
                            <div><span className="text-gray-400 dark:text-gray-500 block text-xs uppercase tracking-widest">Rooms</span>{bookingData.rooms}</div>
                            <div><span className="text-gray-400 dark:text-gray-500 block text-xs uppercase tracking-widest">Paid via</span>{PAYMENT_METHODS.find(m=>m.id===paymentMethod)?.label}</div>
                        </div>
                    </div>

                    {/* Payment split summary */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-4 mb-8 text-sm font-bold text-left space-y-2">
                        <div className="flex justify-between text-green-700 dark:text-green-400">
                            <span>Advance paid now</span><span>₹{advancePrice}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Balance due at check-in</span><span>₹{balanceDue}</span>
                        </div>
                        <div className="flex justify-between font-black text-gray-900 dark:text-white border-t border-blue-200 dark:border-blue-800 pt-2">
                            <span>Total booking value</span><span>₹{bookingData.totalPrice}</span>
                        </div>
                    </div>

                    <button onClick={() => navigate('/my-trips')} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 dark:shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                        View My Trips
                    </button>
                </div>
            </div>
        );
    }

    // Step 3: Processing
    if (step === 3) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-900 p-16 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-gray-100 dark:border-gray-800">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-4 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center">
                            {paymentMethod === 'paypal' ? <PaypalIcon /> : paymentMethod === 'razorpay' ? <RazorpayIcon /> : <CreditCard className="text-blue-600" size={24} />}
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Processing Payment...</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">
                        {paymentMethod === 'paypal' && 'Connecting to PayPal...'}
                        {paymentMethod === 'razorpay' && 'Verifying UPI payment...'}
                        {paymentMethod === 'card' && 'Authorizing your card...'}
                    </p>
                    <div className="flex justify-center gap-2">
                        {[0,1,2].map(i => (
                            <div key={i} className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: `${i*0.15}s`}}></div>
                        ))}
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        <Lock size={12}/> 256-bit SSL encrypted
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                    <ArrowLeft size={20} /> {step === 1 ? 'Back to Property' : 'Back to Details'}
                </button>
            </div>

            {/* Step Indicator */}
            <div className="max-w-7xl mx-auto px-6 mb-10">
                <div className="flex items-center gap-2 max-w-sm">
                    {['Guest Details', 'Payment'].map((label, idx) => (
                        <React.Fragment key={label}>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                                    {step > idx + 1 ? <CheckCircle size={16}/> : idx + 1}
                                </div>
                                <span className={`text-sm font-bold ${step === idx + 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{label}</span>
                            </div>
                            {idx < 1 && <ChevronRight size={16} className="text-gray-300 dark:text-gray-700 shrink-0"/>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left: Form */}
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">
                        {step === 1 ? 'Guest Details' : 'Choose Payment'}
                    </h1>

                    {/* Step 1: Guest Details */}
                    {step === 1 && (
                        <form onSubmit={handleDetailsSubmit} className="space-y-6">
                            <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Who's Staying?</h3>
                                <div>
                                    <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input required type="text" value={formData.name} onChange={(e)=>{ setFormData({...formData, name: e.target.value}); setGuestErrors(p=>({...p,name:''})); }} className={`${inputCls}${guestErrors.name ? ' border-red-400 dark:border-red-600' : ''}`} placeholder="John Doe" />
                                    {guestErrors.name && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">{guestErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={(e)=>{ setFormData({...formData, email: e.target.value}); setGuestErrors(p=>({...p,email:''})); }} className={`${inputCls}${guestErrors.email ? ' border-red-400 dark:border-red-600' : ''}`} placeholder="john@example.com" />
                                    {guestErrors.email && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">{guestErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <PhoneInput
                                        value={phoneMeta}
                                        onChange={(v) => { setPhoneMeta(v); setGuestErrors(p => ({...p, phone: ''})); }}
                                        hasError={!!guestErrors.phone}
                                        placeholder="Phone number"
                                    />
                                    {guestErrors.phone && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">{guestErrors.phone}</p>}
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 dark:shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-2 text-lg">
                                Continue to Payment <ChevronRight size={20}/>
                            </button>
                        </form>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map(method => (
                                    <button
                                        type="button"
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${paymentMethod === method.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === method.id ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                            {method.icon}
                                        </div>
                                        <span className="font-black text-gray-900 dark:text-white">{method.label}</span>
                                        <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                            {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Card Details */}
                            {paymentMethod === 'card' && (
                                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4">
                                    <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2"><CreditCard size={18} className="text-blue-600"/> Card Details</h3>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Card Number</label>
                                        <input required type="text" value={cardData.number} onChange={(e)=>{ setCardData({...cardData, number: formatCardNumber(e.target.value)}); setCardErrors(p=>({...p,number:''})); }} className={`${inputCls} font-mono tracking-widest${cardErrors.number ? ' border-red-400 dark:border-red-600' : ''}`} placeholder="1234 5678 9012 3456" maxLength={19} />
                                        {cardErrors.number && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">{cardErrors.number}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Cardholder Name</label>
                                        <input required type="text" value={cardData.holder} onChange={(e)=>setCardData({...cardData, holder: e.target.value})} className={inputCls} placeholder="JOHN DOE" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Expiry</label>
                                            <input required type="text" value={cardData.expiry} onChange={(e)=>{ setCardData({...cardData, expiry: formatExpiry(e.target.value)}); setCardErrors(p=>({...p,expiry:''})); }} className={`${inputCls} font-mono${cardErrors.expiry ? ' border-red-400 dark:border-red-600' : ''}`} placeholder="MM/YY" maxLength={5} />
                                            {cardErrors.expiry && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">{cardErrors.expiry}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">CVV</label>
                                            <input required type="password" value={cardData.cvv} onChange={(e)=>{ setCardData({...cardData, cvv: e.target.value.replace(/\D/g,'').substring(0,4)}); setCardErrors(p=>({...p,cvv:''})); }} className={`${inputCls} font-mono${cardErrors.cvv ? ' border-red-400 dark:border-red-600' : ''}`} placeholder="•••" maxLength={4} />
                                            {cardErrors.cvv && <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">{cardErrors.cvv}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PayPal */}
                            {paymentMethod === 'paypal' && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-8 rounded-[2rem]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md shrink-0">
                                            <PaypalIcon />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white">Pay with PayPal</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Enter your PayPal email to proceed</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">PayPal Email</label>
                                        <input
                                            type="email"
                                            value={paypalEmail}
                                            onChange={(e) => setPaypalEmail(e.target.value)}
                                            className="w-full p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all"
                                            placeholder="yourname@paypal.com"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Razorpay/UPI */}
                            {paymentMethod === 'razorpay' && (
                                <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 p-8 rounded-[2rem]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                                            <RazorpayIcon />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white">Pay via UPI / Razorpay</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Instant payment via any UPI app</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">UPI ID</label>
                                        <input type="text" value={upiId} onChange={(e)=>setUpiId(e.target.value)} className="w-full p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 outline-none" placeholder="yourname@upi" />
                                    </div>
                                    <div className="mt-4 flex gap-3 flex-wrap">
                                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                                            <span key={app} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg text-xs font-black text-gray-600 dark:text-gray-300 border border-sky-100 dark:border-sky-900 shadow-sm">{app}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Advance amount notice */}
                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-2xl p-4 flex gap-3 items-start">
                                <Info size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                    You are paying <strong>₹{advancePrice}</strong> as advance (50% of total). The remaining <strong>₹{balanceDue}</strong> is due at hotel check-in.
                                </p>
                            </div>

                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 dark:shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-2 text-lg">
                                <Lock size={18}/> Pay Advance ₹{advancePrice}
                            </button>
                            <p className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 flex items-center justify-center gap-1">
                                <ShieldCheck size={14}/> This is a demo payment. No real charges will be made.
                            </p>
                        </form>
                    )}
                </div>

                {/* Right: Booking Summary */}
                <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 h-fit sticky top-10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Booking Summary</h3>
                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <img src={bookingData.hotelImage} className="w-24 h-24 rounded-2xl object-cover" alt="Hotel" />
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Hotel</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{bookingData.hotelName}</p>
                        </div>
                    </div>
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between"><span className="font-bold text-gray-500 dark:text-gray-400">Check-in</span><span className="font-black text-gray-900 dark:text-white">{bookingData.checkIn}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500 dark:text-gray-400">Check-out</span><span className="font-black text-gray-900 dark:text-white">{bookingData.checkOut}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500 dark:text-gray-400">Length of Stay</span><span className="font-black text-gray-900 dark:text-white">{bookingData.nights} Night{bookingData.nights > 1 ? 's' : ''}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500 dark:text-gray-400">Rooms</span><span className="font-black text-gray-900 dark:text-white">{bookingData.rooms} Room{bookingData.rooms > 1 ? 's' : ''}</span></div>
                    </div>

                    {/* Payment split */}
                    <div className="space-y-2 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 text-sm font-bold">
                        <div className="flex justify-between text-blue-600 dark:text-blue-400">
                            <span>Pay now (50% advance)</span>
                            <span>₹{advancePrice}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Pay at check-in (50%)</span>
                            <span>₹{balanceDue}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-gray-900 dark:text-white">Total</span>
                        <span className="text-4xl font-black text-blue-600 dark:text-blue-400">₹{bookingData.totalPrice}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 bg-green-50 dark:bg-green-950/30 p-3 rounded-xl border border-green-100 dark:border-green-900">
                        <ShieldCheck size={16} className="text-green-600 dark:text-green-400 shrink-0"/>
                        <p className="text-xs font-bold text-green-700 dark:text-green-400">Secure checkout. Free cancellation available.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
