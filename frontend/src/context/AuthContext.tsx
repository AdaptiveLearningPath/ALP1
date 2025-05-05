import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { mockUsers } from '../data/mockUsers';

// Create auth context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {
    throw new Error('Not implemented');
  },
  logout: () => {},
  register: async () => {
    throw new Error('Not implemented');
  },
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Simulate login
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && password === 'password123'
        );
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          setIsLoading(false);
          resolve(foundUser);
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Register
  const register = async (userData: Partial<User>, password: string): Promise<User> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: `user-${Date.now()}`,
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'child',
          avatar: userData.avatar,
        } as User;
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsLoading(false);
        resolve(newUser);
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};