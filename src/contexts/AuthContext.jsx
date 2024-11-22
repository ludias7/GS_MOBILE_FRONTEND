import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { getToken, setToken, removeToken } from '../utils/token';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = getToken();
            if (token) {
                try {
                    const response = await api.get('/users/profile');
                    setUser(response.data);
                } catch (error) {
                    removeToken();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            setToken(response.data.token);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);