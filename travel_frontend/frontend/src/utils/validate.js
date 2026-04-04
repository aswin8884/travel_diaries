// Shared validation helpers

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const isValidPhone = (v) => {
    const digits = v.replace(/\D/g, '');
    // Accept 10-digit Indian numbers, optionally prefixed with 91
    return /^(?:91)?[6-9]\d{9}$/.test(digits);
};

// Country-aware phone validation — dialCode e.g. '+91', number is digits only
const PHONE_RULES = {
    '+91':  /^[6-9]\d{9}$/,       // India: 10 digits
    '+1':   /^\d{10}$/,             // US / Canada: 10 digits
    '+44':  /^\d{10}$/,             // UK: 10 digits (without leading 0)
    '+971': /^5\d{8}$/,            // UAE: 9 digits, starts with 5
    '+61':  /^4\d{8}$/,            // Australia: 9 digits, starts with 4
    '+49':  /^\d{10,12}$/,         // Germany: 10-12 digits
    '+33':  /^[67]\d{8}$/,         // France: 9 digits
    '+65':  /^[689]\d{7}$/,        // Singapore: 8 digits
    '+81':  /^\d{10,11}$/,         // Japan: 10-11 digits
    '+86':  /^\d{11}$/,             // China: 11 digits
    '+55':  /^\d{10,11}$/,         // Brazil: 10-11 digits
    '+39':  /^\d{9,10}$/,          // Italy: 9-10 digits
    '+34':  /^[6-9]\d{8}$/,        // Spain: 9 digits
    '+7':   /^\d{10}$/,             // Russia: 10 digits
    '+60':  /^\d{9,10}$/,          // Malaysia: 9-10 digits
    '+66':  /^\d{9}$/,              // Thailand: 9 digits
    '+27':  /^\d{9}$/,              // South Africa: 9 digits
    '+64':  /^\d{8,10}$/,          // New Zealand: 8-10 digits
    '+92':  /^3\d{9}$/,            // Pakistan: 10 digits, starts with 3
    '+880': /^1[3-9]\d{8}$/,      // Bangladesh: 10 digits
    '+94':  /^7\d{8}$/,            // Sri Lanka: 9 digits, starts with 7
    '+977': /^9[6-8]\d{8}$/,      // Nepal: 10 digits
    '+966': /^5\d{8}$/,            // Saudi Arabia: 9 digits, starts with 5
    '+965': /^[569]\d{7}$/,        // Kuwait: 8 digits
    '+974': /^[3-7]\d{7}$/,        // Qatar: 8 digits
    '+968': /^[279]\d{7}$/,        // Oman: 8 digits
    '+973': /^[36]\d{7}$/,         // Bahrain: 8 digits
    '+960': /^\d{7}$/,              // Maldives: 7 digits
};

const PHONE_HINTS = {
    '+91':  '10 digits starting with 6–9',
    '+1':   '10 digits',
    '+44':  '10 digits',
    '+971': '9 digits starting with 5',
    '+61':  '9 digits starting with 4',
    '+49':  '10–12 digits',
    '+33':  '9 digits',
    '+65':  '8 digits',
    '+81':  '10–11 digits',
    '+86':  '11 digits',
    '+55':  '10–11 digits',
    '+39':  '9–10 digits',
    '+34':  '9 digits starting with 6–9',
    '+7':   '10 digits',
    '+60':  '9–10 digits',
    '+66':  '9 digits',
    '+27':  '9 digits',
    '+64':  '8–10 digits',
    '+92':  '10 digits starting with 3',
    '+880': '10 digits',
    '+94':  '9 digits starting with 7',
    '+977': '10 digits starting with 9',
    '+966': '9 digits starting with 5',
    '+965': '8 digits',
    '+974': '8 digits',
    '+968': '8 digits',
    '+973': '8 digits',
    '+960': '7 digits',
};

export const isValidPhoneForCountry = (number, dialCode) => {
    const digits = (number || '').replace(/\D/g, '');
    if (!digits) return false;
    const rule = PHONE_RULES[dialCode];
    if (!rule) return digits.length >= 6 && digits.length <= 12;
    return rule.test(digits);
};

export const phoneHint = (dialCode) =>
    PHONE_HINTS[dialCode] || '6–12 digits';

export const isValidPassword = (v) => ({
    minLength: v.length >= 8,
    hasUpper: /[A-Z]/.test(v),
    hasNumber: /\d/.test(v),
    hasSpecial: /[^a-zA-Z0-9]/.test(v),
    get valid() { return this.minLength && this.hasUpper && this.hasNumber && this.hasSpecial; }
});

export const isValidName = (v) => v.trim().length >= 2;

export const isValidCardNumber = (v) => /^\d{4} \d{4} \d{4} \d{4}$/.test(v.trim());

export const isValidCVV = (v) => /^\d{3,4}$/.test(v.trim());

export const isValidExpiry = (v) => {
    const match = v.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const [, mm, yy] = match;
    const month = parseInt(mm, 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const expYear = 2000 + parseInt(yy, 10);
    const expMonth = month;
    return expYear > now.getFullYear() || (expYear === now.getFullYear() && expMonth >= now.getMonth() + 1);
};

export const isValidLatitude = (v) => {
    const n = parseFloat(v);
    return !isNaN(n) && n >= -90 && n <= 90;
};

export const isValidLongitude = (v) => {
    const n = parseFloat(v);
    return !isNaN(n) && n >= -180 && n <= 180;
};

export const isValidRating = (v) => {
    const n = parseFloat(v);
    return !isNaN(n) && n >= 1 && n <= 5;
};

export const isValidPrice = (v) => {
    const n = parseFloat(v);
    return !isNaN(n) && n > 0;
};
