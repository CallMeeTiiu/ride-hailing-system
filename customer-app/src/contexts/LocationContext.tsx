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

export const ALL_LOCATIONS_DB: LocationItem[] = [
  { id: '1', name: 'Grand Indonesia Mall', address: 'Jl. M.H. Thamrin No.1', distance: '1.2 km', latitude: -6.1949, longitude: 106.8209 },
  { id: '2', name: 'Soekarno-Hatta Airport', address: 'Tangerang City, Banten', distance: '15.5 km', latitude: -6.1256, longitude: 106.6558 },
  { id: '3', name: 'Central Park', address: 'Letjen S. Parman St', distance: '4.8 km', latitude: -6.1774, longitude: 106.7907 },
  { id: '4', name: 'Times Square', address: 'Manhattan, NY 10036, USA', distance: '8.3 km', latitude: 40.7580, longitude: -73.9855 },
  { id: '5', name: 'Empire State Building', address: '20 W 34th St., New York', distance: '9.1 km', latitude: 40.7484, longitude: -73.9857 },
  { id: '6', name: 'Statue of Liberty', address: 'New York, NY 10004, USA', distance: '12.4 km', latitude: 40.6892, longitude: -74.0445 },
];

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