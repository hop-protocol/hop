// ThemeContext.js or ThemeContext.ts
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from './theme'; // Import your custom themes

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    try {
      const cached = localStorage.getItem('darkMode');
      if (typeof cached === 'string') {
        return cached === 'true';
      }
    } catch (err) {
      console.error(err);
    }
    return true;
  });

  const toggleTheme = () => {
    setDark((prevDark) => !prevDark);
  };

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', `${dark}`);
    } catch (err) {
      console.error(err);
    }
  }, [dark]);

  const theme = createTheme(dark ? darkTheme : lightTheme);

  return (
    <ThemeContext.Provider value={{ dark, theme, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
