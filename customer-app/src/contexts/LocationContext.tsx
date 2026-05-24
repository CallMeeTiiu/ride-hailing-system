import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
}

export const ALL_LOCATIONS_DB: LocationItem[] = [];

interface LocationContextType { 
  allLocations: LocationItem[];
  recentLocations: LocationItem[];
  fromLocation: LocationItem | null;
  destinationLocation: LocationItem | null;

  addRecentLocation: (item: LocationItem) => void;
  removeRecentLocation: (id: string) => void;
  clearAllRecent: () => void;
  setFromLocation: (item: LocationItem | null) => void;
  setDestinationLocation: (item: LocationItem | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentLocations, setRecentLocations] = useState<LocationItem[]>([]);

  const [fromLocation, setFromLocation] = useState<LocationItem | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LocationItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@recent_locations');
        if (storedData) {
          setRecentLocations(JSON.parse(storedData));
        }
      } catch (error) {
        console.log('Error while loading location data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@recent_locations', JSON.stringify(recentLocations));
      } catch (error) {
        console.log('Error while saving location data:', error);
      }
    };
    saveData();
  }, [recentLocations]);

  const addRecentLocation = (item: LocationItem) => {
    setRecentLocations(prev => {
      const filteredList = prev.filter(loc => loc.id !== item.id);
      return [item, ...filteredList];
    });
  };

  const removeRecentLocation = (id: string) => {
    setRecentLocations(prev => prev.filter(item => item.id !== id));
  };

  const clearAllRecent = () => {
    setRecentLocations([]);
  };

  return (
    <LocationContext.Provider value={{ 
        allLocations: ALL_LOCATIONS_DB,
        recentLocations, 
        fromLocation,
        destinationLocation,
        addRecentLocation, 
        removeRecentLocation, 
        clearAllRecent,
        setFromLocation,
        setDestinationLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};