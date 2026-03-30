import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // When the app loads, check if they already have a token saved
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Remember, we customized Django to put the 'role' inside the token!
                setUser({ email: decoded.email, role: decoded.role });
            } catch (error) {
                console.error("Invalid token");
                localStorage.removeItem('access_token');
            }
        }
    }, []);

    // New login function: takes the real token from Django
    const login = (token) => {
        localStorage.setItem('access_token', token);
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, role: decoded.role });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};