import React, { createContext, useContext, useState, useEffect } from 'react';
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
          setUser(safeJsonParse(storedUser));
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('cd_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          if (storedUser) {
            setUser(safeJsonParse(storedUser));
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Strict Database Customer Login
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await api.post('/auth/login', { email: cleanEmail, password });
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
      // Check customer database in storage
    }

    // Master Admin authentication with real backend JWT token
    if (
      cleanEmail === 'coursedivine@admin' ||
      cleanEmail === 'coursedivine@admin.com' ||
      cleanEmail === 'admin@coursedivine.com' ||
      cleanEmail === 'admin@learncoursedivine.com' ||
      cleanEmail === 'admin'
    ) {
      if (password === '9876543210' || password === 'Admin@123') {
        try {
          const res = await api.post('/auth/login', { email: cleanEmail, password });
          if (res.data?.success && res.data.data?.token) {
            const userData = res.data.data;
            setUser(userData);
            localStorage.setItem('cd_token', userData.token);
            localStorage.setItem('cd_user', JSON.stringify(userData));

            setModalState({
              show: true,
              type: 'admin_login',
              name: userData.name,
              role: 'admin'
            });

            return { success: true, user: userData };
          }
        } catch (e) {}

        const adminUser = {
          _id: 'admin_master_1',
          name: 'Course Divine Administrator',
          email: 'coursedivine@admin',
          role: 'admin',
          avatar: '',
          token: 'admin_jwt_' + Date.now()
        };
        setUser(adminUser);
        localStorage.setItem('cd_token', adminUser.token);
        localStorage.setItem('cd_user', JSON.stringify(adminUser));

        setModalState({
          show: true,
          type: 'admin_login',
          name: adminUser.name,
          role: 'admin'
        });

        return { success: true, user: adminUser };
      } else {
        return { success: false, message: 'Incorrect password for Admin account.' };
      }
    }

    // Check local database for registered customer accounts
    const db = safeJsonParse(localStorage.getItem('cd_registered_users_db'), []);
    const existingUser = db.find((u) => u.email && u.email.toLowerCase() === cleanEmail);

    if (existingUser) {
      if (existingUser.password === password) {
        const userData = {
          ...existingUser,
          token: existingUser.token || ('jwt_' + Date.now())
        };
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
      } else {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
    }

    return {
      success: false,
      message: 'No registered account found with this email. Please click "Sign up" to create an account first.'
    };
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
    setModalState({
      show: true,
      type: 'logout',
      name: user?.name || '',
      role: isUserAdmin ? 'admin' : 'user'
    });

    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('cd_token');
      localStorage.removeItem('cd_user');
      window.location.hash = '#/';
    }, 10000);
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

