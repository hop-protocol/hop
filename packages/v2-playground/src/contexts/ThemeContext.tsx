import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Define the context shape
type ThemeContextType = {
  darkMode: boolean
  toggleDarkMode: () => void
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {}
})

// Create light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d56ec6',
    },
    secondary: {
      main: '#6e42ca',
    },
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e27bd8',
    },
    secondary: {
      main: '#8e68e0',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
})

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Check if dark mode preference exists in localStorage
  const getInitialMode = (): boolean => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      return savedMode === 'true'
    }
    // If not in localStorage, check user's system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Initialize state with the value from localStorage or system preference
  const [darkMode, setDarkMode] = useState<boolean>(false)
  
  // Set initial state after component mount (for SSR compatibility)
  useEffect(() => {
    setDarkMode(getInitialMode())
  }, [])

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  // Choose theme based on darkMode state
  const theme = darkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext) 