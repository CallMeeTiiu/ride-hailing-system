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
    lat: item.latitude,
    lng: item.longitude,
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

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await apiClient.get('/users/addresses');
        
        // MẮT THẦN: In toàn bộ dữ liệu Backend trả về ra console để xem mặt mũi nó ra sao
        console.log("=== DỮ LIỆU GET TỪ BACKEND ===", JSON.stringify(response.data, null, 2));
        
        // KIỂM TRA AN TOÀN: Nếu Backend bọc mảng trong biến 'data', ta sẽ tự động gỡ mảng ra
        const dataArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
        
        if (dataArray.length === 0) {
           console.log("Cảnh báo: Danh sách rỗng, Backend không trả về địa chỉ nào!");
        }

        // Đưa qua bộ chuyển đổi và render lên UI
        setAddresses(dataArray.map(mapToFrontend)); 
        
      } catch (error: any) {
        console.log('=== LỖI FETCH ADDRESS ===', error.response?.data || error);
      }
    };

    if (isAuthenticated) {
      fetchAddresses();
    } else {
      setAddresses([]); 
    }
  }, [isAuthenticated]);

  const addAddress = async (address: SavedAddress) => {
    try {
      const payload = mapToBackend(address); 
      const response = await apiClient.post('/users/addresses', payload);
      
      setAddresses((prev) => [...prev, mapToFrontend(response.data)]);
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

      const response = await apiClient.put(`/users/addresses/${id}`, payload);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? mapToFrontend(response.data) : addr))
      );
    } catch (error) {
      console.log('Error updating address:', error);
    }
  };

  const removeAddress = async (id: string) => {
    try {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      await apiClient.delete(`/users/addresses/${id}`);
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