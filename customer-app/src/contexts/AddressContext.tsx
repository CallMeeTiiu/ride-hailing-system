import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../utils/apiClient';

export interface SavedAddress {
  id: string;
  name: string;        
  details: string;     
  lat: number | null;  
  lng: number | null;  
  icon: string;        
}

interface AddressContextType {
  addresses: SavedAddress[];
  addAddress: (address: SavedAddress) => void;
  updateAddress: (id: string, updatedAddress: Partial<SavedAddress>) => void;
  removeAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const { isAuthenticated, user } = useAuth();

  const mapToFrontend = (item: any): SavedAddress => ({
    id: item.id?.toString(),
    name: item.label,
    details: item.address_text,
    lat: Number(item.latitude),
    lng: Number(item.longitude),
    icon: item.icon,
  });

  const mapToBackend = (address: Partial<SavedAddress>) => ({
    customer_user_id: user?.id, 
    label: address.name,
    address_text: address.details,
    latitude: address.lat,
    longitude: address.lng,
    icon: address.icon,
  });

  const fetchAddresses = async () => {
    if (!user?.id) return;
    try {
      const response = await apiClient.get('/users/addresses', {
        params: { customer_user_id: user.id }
      });
      
      const dataArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setAddresses(dataArray.map(mapToFrontend)); 
    } catch (error: any) {
      console.log('Lỗi fetch array: ', error.response?.data || error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAddresses();
    } else {
      setAddresses([]); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const addAddress = async (address: SavedAddress) => {
    try {
      const payload = mapToBackend(address);
      await apiClient.post('/users/addresses', payload);

      await fetchAddresses();
    } catch (error) {
      console.log('Error adding address:', error);
    }
  };

  const updateAddress = async (id: string, updatedData: Partial<SavedAddress>) => {
    try {
      const payload: any = {};
      if (updatedData.name !== undefined) payload.label = updatedData.name;
      if (updatedData.details !== undefined) payload.address_text = updatedData.details;
      if (updatedData.lat !== undefined) payload.latitude = updatedData.lat;
      if (updatedData.lng !== undefined) payload.longitude = updatedData.lng;
      if (updatedData.icon !== undefined) payload.icon = updatedData.icon;

      await apiClient.put(`/users/addresses/${id}`, payload);
      await fetchAddresses();
    } catch (error) {
      console.log('Error updating address:', error);
    }
  };

  const removeAddress = async (id: string) => {
    try {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      await apiClient.delete(`/users/addresses/${id}`);
      await fetchAddresses();
    } catch (error) {
      console.log('Error removing address:', error);
    }
  };

  return (
    <AddressContext.Provider value={{ addresses, addAddress, updateAddress, removeAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};