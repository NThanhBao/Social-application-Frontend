import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

function AuthHandler() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('User is logged in');
        } else {
            console.log('User is not logged in');
        }
    }, []);

    return null;
}

export default AuthHandler;
