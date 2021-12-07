import React, { createContext, FC, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme'
import { useLocalStorage } from 'react-use'

const shadows = {
  top: `
    5px -5px 10px #666077b5,
    -5px 5px 10px rgba(11, 9, 30, 0.6)`,
  bottom: `
    5px -5px 10px #FFFFFF,
    -5px 5px 10px #66607733`,
}

export const styledSystemTheme = {
  // 640px, 832px, 1024px, 1440px
  // '40em', '52em', '64em', '90em'
  breakpoints: ['640px', '832px', '1024px', '1440px'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 36, 48, 80, 96],
  fontWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5,
  },
  fonts: ['Helvetica', 'sans-serif'],
  borders: [0, '1px solid black', '1px solid #00FFFF'],
  radii: [0, 2, 4, 16, 9999, '100%'],
  shadows: ['none', shadows.top, shadows.bottom],
  sizes: [16, 32, 64, 128, 256],
  colors: {
    ...lightTheme.palette,
    dark: darkTheme.palette,
  },
}

interface ThemeContextValues {
  mode?: string
  toggleMode: any
}

const ThemeContext = createContext<ThemeContextValues>({
  mode: 'light',
  toggleMode: () => {},
})

const cacheKey = 'ui-theme-mode'

const ThemeProvider: FC = ({ children }) => {
  const [mode, setMode] = useLocalStorage(cacheKey, 'light')
  const [theme, setTheme] = useState(mode === 'light' ? lightTheme : darkTheme)

  function toggleMode() {
    if (mode === 'light') {
      setMode('dark')
    } else {
      setMode('light')
    }
  }

  useEffect(() => {
    if (mode === 'dark') {
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }
  }, [mode])

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleMode,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <SCThemeProvider theme={styledSystemTheme}>{children}</SCThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}
export const useThemeMode = () => useContext(ThemeContext)

export default ThemeProvider
