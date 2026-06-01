import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; 

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  address?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (newData: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setProfile({
        name: "Khanh",
        email: "khanh@gmail.com",
        avatar: "https://i.pravatar.cc/150",
        address: "Hồ Chí Minh, Việt Nam"
      });
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, user]);

  const updateProfile = async (newData: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...newData } : null);
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};