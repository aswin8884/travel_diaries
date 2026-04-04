// Shared validation helpers

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const isValidPhone = (v) => {
    const digits = v.replace(/\D/g, '');
    // Accept 10-digit Indian numbers, optionally prefixed with 91
    return /^(?:91)?[6-9]\d{9}$/.test(digits);
};

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
