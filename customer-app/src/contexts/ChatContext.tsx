import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatMessage {
  text: string;
  sender: 'CUSTOMER' | 'DRIVER';
  timestamp: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  hasUnread: boolean;
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  setUnread: (status: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const savedChat = await AsyncStorage.getItem('chat_history');
        if (savedChat) {
          setMessages(JSON.parse(savedChat));
        }
      } catch (error) {
        console.error('Lỗi khi load chat:', error);
      }
    };
    loadChat();
  }, []);

  useEffect(() => {
    const saveChat = async () => {
      try {
        await AsyncStorage.setItem('chat_history', JSON.stringify(messages));
      } catch (error) {
        console.error('Lỗi khi save chat:', error);
      }
    };
    saveChat();
  }, [messages]);

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    setHasUnread(true); 
  };

  const clearChat = async () => {
    setMessages([]);
    setHasUnread(false);
    await AsyncStorage.removeItem('chat_history');
  };

  const setUnread = (status: boolean) => {
    setHasUnread(status);
  };

  return (
    <ChatContext.Provider value={{ messages, hasUnread, addMessage, clearChat, setUnread }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};