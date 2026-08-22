import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, userApi } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('asiandrama_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Watchlist state (synced with DB when logged in, localStorage when guest)
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('dramalist_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleLogout = useCallback(() => {
    localStorage.removeItem('asiandrama_token');
    setToken(null);
    setUser(null);
    // Keep local watchlist for guest browsing
  }, []);

  // Verify token on initial load
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.user) {
            setUser(res.user);
            if (res.user.watchlist) {
              setWatchlist(res.user.watchlist);
            }
          } else {
            handleLogout();
          }
        } catch (err) {
          console.warn('Auto login failed or token expired:', err.message);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, handleLogout]);

  // Sync guest watchlist to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('dramalist_watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, user]);

  const handleLogin = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.token && res.user) {
      localStorage.setItem('asiandrama_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.watchlist) {
        setWatchlist(res.user.watchlist);
      }
      setIsAuthModalOpen(false);
      return res.user;
    }
  };

  const handleRegister = async (username, email, password) => {
    const res = await authApi.register(username, email, password);
    if (res.token && res.user) {
      localStorage.setItem('asiandrama_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.watchlist) {
        setWatchlist(res.user.watchlist);
      }
      setIsAuthModalOpen(false);
      return res.user;
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Watchlist Actions
  const addToWatchlist = async (dramaItem) => {
    const item = {
      id: String(dramaItem.id),
      title: dramaItem.name || dramaItem.title || dramaItem.original_name || dramaItem.original_title || 'Untitled',
      poster_path: dramaItem.poster_path || '',
      media_type: dramaItem.media_type || (dramaItem.first_air_date ? 'tv' : 'movie'),
      status: dramaItem.status || 'watching',
      score: dramaItem.score || dramaItem.vote_average || 0,
      vote_average: dramaItem.vote_average || 0,
      first_air_date: dramaItem.first_air_date || dramaItem.release_date || ''
    };

    if (user) {
      // Logged in: Sync with MongoDB backend
      try {
        const res = await userApi.addToWatchlist(item);
        if (res.watchlist) setWatchlist(res.watchlist);
      } catch (err) {
        console.error('Failed to sync watchlist to DB:', err);
      }
    } else {
      // Guest: Add to local state & localStorage
      setWatchlist((prev) => {
        const exists = prev.some(w => String(w.id) === String(item.id));
        if (exists) return prev;
        return [item, ...prev];
      });
    }
  };

  const removeFromWatchlist = async (id) => {
    const itemId = String(id);
    if (user) {
      try {
        const res = await userApi.removeFromWatchlist(itemId);
        if (res.watchlist) setWatchlist(res.watchlist);
      } catch (err) {
        console.error('Failed to remove watchlist from DB:', err);
      }
    } else {
      setWatchlist((prev) => prev.filter(w => String(w.id) !== itemId));
    }
  };

  const isInWatchlist = (id) => {
    return watchlist.some(w => String(w.id) === String(id));
  };

  const updateProfile = async (data) => {
    const res = await userApi.updateProfile(data);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
