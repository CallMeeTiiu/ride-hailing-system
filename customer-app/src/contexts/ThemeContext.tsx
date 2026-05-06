import React, { createContext, useContext, useState } from 'react';
import theme from '../constants/theme'; 

interface ThemeContextProps {
  isDarkMode: boolean;
  colors: typeof theme.lightColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  isDarkMode: false,
  colors: theme.lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const colors = isDarkMode ? theme.darkColors : theme.lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);