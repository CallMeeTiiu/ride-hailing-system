import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../utils/apiClient'; 
export interface UserProfile {
  id: string;
  phone_number: string;
  name: string;
  email: string;
  avatar_url: string;
  dob?: string;
  gender?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  isLoadingProfile: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (newData: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (uri: string, mimeType: string, fileName: string) => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const { isAuthenticated } = useAuth();

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await apiClient.get('/customers/me');
      const data = response.data; 
      
      console.log('=== DATA TỪ GET /customers/me ===', JSON.stringify(data, null, 2));

      setProfile({
        id: data.user?.id || data.id,
        phone_number: data.user?.phone_number || data.phone_number || '',
        name: data.profile?.name || data.name || '',
        email: data.profile?.email || data.email || '',
        avatar_url: data.profile?.avatar_url || data.avatar_url || '',
        dob: data.profile?.dob || data.dob || '',
        gender: data.profile?.gender || data.gender || '',
      });
    } catch (error: any) {
      console.log('❌ Lỗi load profile:', error.response?.data || error.message);
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated]);

  const updateProfile = async (newData: Partial<UserProfile>) => {
    try {
      await apiClient.put('/customers/me', newData);
      setProfile(prev => prev ? { ...prev, ...newData } : null);
    } catch (error) {
      console.error('Lỗi khi cập nhật Profile:', error);
      throw error; 
    }
  };

  const uploadAvatar = async (imageUri: string, mimeType: string, fileName: string) => {
    try {
      // 1. Khởi tạo FormData
      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: mimeType, 
        name: fileName, 
      } as any);

      const response = await apiClient.post('/customers/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchProfile();
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi upload Avatar:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ profile, isLoadingProfile, fetchProfile, updateProfile, uploadAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};