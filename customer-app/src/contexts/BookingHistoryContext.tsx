import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationItem } from './LocationContext';
import { DriverData } from '../components/booking/DriverBottomCard';

export interface Trip {
  id: string;
  driver: DriverData;
  fromLocation: LocationItem;
  destinationLocation: LocationItem;
  completionTime: string;
  rating: number | null; 
  comment?: string;
}

interface BookingHistoryContextType {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  updateTripRating: (id: string, rating: number, comment?: string) => void;
}

const BookingHistoryContext = createContext<BookingHistoryContextType | undefined>(undefined);

export const BookingHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  // Tải dữ liệu khi mở app
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@trip_history');
        if (storedData) {
          setTrips(JSON.parse(storedData));
        }
      } catch (error) {
        console.log('Error while loading trip history:', error);
      }
    };
    loadData();
  }, []);

  // Tự động lưu dữ liệu khi mảng trips có thay đổi
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@trip_history', JSON.stringify(trips));
      } catch (error) {
        console.log('Error while saving trip history:', error);
      }
    };
    saveData();
  }, [trips]);

  const addTrip = (trip: Trip) => {
    setTrips((prev) => [trip, ...prev]);
  };

  const updateTripRating = (id: string, rating: number, comment?: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, rating, comment } : trip
      )
    );
  };

  return (
    <BookingHistoryContext.Provider value={{ trips, addTrip, updateTripRating }}>
      {children}
    </BookingHistoryContext.Provider>
  );
};

export const useBookingHistory = () => {
  const context = useContext(BookingHistoryContext);
  if (!context) {
    throw new Error('useBookingHistory must be used within a BookingHistoryProvider');
  }
  return context;
};