import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@saved_addresses');
        if (storedData) {
          setAddresses(JSON.parse(storedData));
        } else {
          setAddresses([
            { id: 'home', name: 'Home', details: 'Tap to add your home address', lat: null, lng: null, icon: 'home' },
            { id: 'work', name: 'Office', details: 'Tap to add your work address', lat: null, lng: null, icon: 'briefcase' }
          ]);
        }
      } catch (error) {
        console.log('Error while loading addresses:', error);
      } finally {
        setIsLoaded(true); 
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return; 

    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@saved_addresses', JSON.stringify(addresses));
      } catch (error) {
        console.log('Error while saving addresses:', error);
      }
    };
    saveData();
  }, [addresses, isLoaded]);

  const addAddress = (address: SavedAddress) => {
    setAddresses((prev) => [...prev, address]);
  };

  const updateAddress = (id: string, updatedData: Partial<SavedAddress>) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, ...updatedData } : addr
      )
    );
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
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