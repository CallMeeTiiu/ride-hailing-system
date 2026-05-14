import React, { createContext, useContext, useState } from 'react';

export interface AddressItem {
  id: string;
  title: string;    
  address: string;
  isDefault?: boolean;
}

export interface UserData {
  name: string;
  phoneNumber: string;
  avatar: string;
  email: string;
  dob?: string;     
  gender?: string;
  addresses: AddressItem[];
}

interface UserContextProps {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateUser: (data: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>({
    name: "Andrew Ainsley",
    phoneNumber: "+1 111 467 378 399",
    avatar: "https://i.pravatar.cc/150?u=andrew",
    email: "andrew_ainsley@yourdomain.com",
    dob: "12/27/1995",
    gender: "Male",
    addresses: [
      { id: '1', title: 'Home', address: '1A Queen, New York, USA', isDefault: true },
      { id: '2', title: 'Office', address: '100 King St, New York, USA' }
    ]
  });

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};