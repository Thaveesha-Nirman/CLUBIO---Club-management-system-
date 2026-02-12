import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * * Member 01 : feature/auth-fullstack-36682
 * * React Context for managing user authentication state across the application.
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /**
   * * Member 01 : Provider component that wraps the app and supplies auth state.
   */
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('clubUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    /**
     * * Member 01 : Updates state and localStorage upon successful login.
     */
    setUser(userData);
    localStorage.setItem('clubUser', JSON.stringify(userData));
  };

  const logout = () => {
    /**
     * * Member 01 : Clears state and localStorage to log the user out.
     */
    setUser(null);
    localStorage.removeItem('clubUser');
  };

  const updateUser = (newUserData) => {
    /**
     * * Member 01 : Updates the current user's information in state and localStorage.
     */
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newUserData };

      localStorage.setItem('clubUser', JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'clubUser' && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);