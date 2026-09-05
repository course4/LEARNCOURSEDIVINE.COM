import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import AuthStatusModal from '../components/AuthStatusModal';

const safeJsonParse = (str, fallback = null) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    return fallback;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ show: false, type: 'login', name: '', role: 'user' });

  // Load user from localStorage or API on initial render
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('cd_user');
      const token = localStorage.getItem('cd_token');

      if (token && storedUser) {
        try {
          const parsed = safeJsonParse(storedUser);
          if (parsed) {
            setUser(parsed);
          }
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('cd_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setUser(null);
            localStorage.removeItem('cd_token');
            localStorage.removeItem('cd_user');
          } else {
            const parsed = safeJsonParse(storedUser);
            if (parsed && !token.startsWith('admin_jwt_')) {
              setUser(parsed);
            } else {
              setUser(null);
              localStorage.removeItem('cd_token');
              localStorage.removeItem('cd_user');
            }
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem('cd_token');
        localStorage.removeItem('cd_user');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Database Customer & Master Admin Login via API (with Render cloud backup)
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      let res;
      try {
        res = await api.post('/auth/login', { email: cleanEmail, password });
      } catch (e1) {
        try {
          res = await axios.post('https://coursedivinewebsite.onrender.com/api/auth/login', { email: cleanEmail, password });
        } catch (e2) {
          console.error('Login attempt failed:', e2);
          throw e2;
        }
      }

      if (res.data?.success) {
        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem('cd_token', userData.token);
        localStorage.setItem('cd_user', JSON.stringify(userData));
        
        const role = (userData.role === 'admin' || cleanEmail.includes('admin')) ? 'admin' : 'user';
        setModalState({
          show: true,
          type: role === 'admin' ? 'admin_login' : 'login',
          name: userData.name,
          role
        });

        return { success: true, user: userData };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    }

    return { success: false, message: 'Invalid email or password' };
  };

  // Google One-Click OAuth Authentication & Auto-Registration
  const loginWithGoogle = async (googleProfile) => {
    try {
      const email = googleProfile.email.trim().toLowerCase();
      const name = googleProfile.name?.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      const db = safeJsonParse(localStorage.getItem('cd_registered_users_db'), []);
      let googleUser = db.find((u) => u.email && u.email.toLowerCase() === email);

      if (!googleUser) {
        // Automatically create and register new customer account in the database
        googleUser = {
          _id: 'usr_' + Date.now(),
          name,
          email,
          avatar: '',
          role: email.includes('admin') ? 'admin' : 'user',
          authProvider: 'google',
          phone: googleProfile.phone || '',
          referralCode: 'CD' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          registeredAt: new Date().toISOString(),
          token: 'google_jwt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)
        };
        db.push(googleUser);
        localStorage.setItem('cd_registered_users_db', JSON.stringify(db));
      }

      setUser(googleUser);
      localStorage.setItem('cd_token', googleUser.token);
      localStorage.setItem('cd_user', JSON.stringify(googleUser));

      const role = googleUser.role === 'admin' ? 'admin' : 'user';
      setModalState({
        show: true,
        type: role === 'admin' ? 'admin_login' : 'login',
        name: googleUser.name,
        role
      });

      return { success: true, user: googleUser };
    } catch (err) {
      return { success: false, message: 'Google authentication failed. Please try again.' };
    }
  };

  const register = async (name, email, password, phone, referralCode) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      const res = await api.post('/auth/register', { name: cleanName, email: cleanEmail, password, phone, referralCode });
      if (res.data?.success) {
        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem('cd_token', userData.token);
        localStorage.setItem('cd_user', JSON.stringify(userData));

        const role = userData.role === 'admin' ? 'admin' : 'user';
        setModalState({
          show: true,
          type: role === 'admin' ? 'admin_login' : 'register',
          name: userData.name,
          role
        });

        return { success: true, user: userData };
      }
    } catch (error) {
      // Local database fallback
    }

    const db = safeJsonParse(localStorage.getItem('cd_registered_users_db'), []);
    const userExists = db.some((u) => u.email && u.email.toLowerCase() === cleanEmail);

    if (userExists) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUserData = {
      _id: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password,
      phone: phone || '',
      role: (cleanEmail.includes('admin') || cleanEmail.startsWith('admin@')) ? 'admin' : 'user',
      referralCode: referralCode || ('CD' + Math.random().toString(36).substring(2, 8).toUpperCase()),
      avatar: '',
      registeredAt: new Date().toISOString(),
      token: 'jwt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)
    };

    db.push(newUserData);
    localStorage.setItem('cd_registered_users_db', JSON.stringify(db));

    setUser(newUserData);
    localStorage.setItem('cd_token', newUserData.token);
    localStorage.setItem('cd_user', JSON.stringify(newUserData));

    const role = newUserData.role === 'admin' ? 'admin' : 'user';
    setModalState({
      show: true,
      type: role === 'admin' ? 'admin_login' : 'register',
      name: newUserData.name,
      role
    });

    return { success: true, user: newUserData };
  };

  const logout = () => {
    const currentName = user?.name || '';
    const currentRole = isUserAdmin ? 'admin' : 'user';

    setUser(null);
    localStorage.removeItem('cd_token');
    localStorage.removeItem('cd_user');

    setModalState({
      show: true,
      type: 'logout',
      name: currentName,
      role: currentRole
    });

    setTimeout(() => {
      setModalState({ show: false, type: 'login', name: '', role: 'user' });
      window.location.hash = '#/';
    }, 1500);
  };

  const updateUserData = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('cd_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Helper to get isolated user data key
  const getUserStorageKey = (key) => {
    const emailKey = user?.email ? user.email.toLowerCase() : 'guest';
    return `cd_user_${emailKey}_${key}`;
  };

  const isUserAdmin = Boolean(
    user?.role === 'admin' ||
    (user?.email && user.email.toLowerCase().includes('admin'))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: isUserAdmin,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUserData,
        getUserStorageKey
      }}
    >
      {children}
      <AuthStatusModal
        state={modalState}
        onClose={() => setModalState({ show: false, type: 'login', name: '', role: 'user' })}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

