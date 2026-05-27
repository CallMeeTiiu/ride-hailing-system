import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  role: string;
  phone_number: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('@mock_access_token');
        const userData = await AsyncStorage.getItem('@mock_user_info');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Lỗi đọc AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (phoneNumber: string, password?: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(async () => {
        if (phoneNumber && password) {
          const mockUser: User = {
            id: 'mock_user_id_123',
            role: 'CUSTOMER',
            phone_number: phoneNumber,
          };

          await AsyncStorage.setItem('@mock_access_token', 'fake_jwt_token_abc123');
          await AsyncStorage.setItem('@mock_user_info', JSON.stringify(mockUser));

          setUser(mockUser);
          setIsAuthenticated(true);
          resolve(true); 
        } else {
          resolve(false); 
        }
      }, 1000);
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@mock_access_token');
    await AsyncStorage.removeItem('@mock_user_info');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};