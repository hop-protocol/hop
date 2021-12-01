import React, { createContext, FC, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme'
import { boxShadows } from './light'

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
  shadows: [
    '0px 5px 20px rgba(0, 0, 0, 0.1)',
    '0px 4px 10px #00000099',
    'inset 0px 2px 4px rgba(0, 0, 0, 0.25)',
    // ...Object.values(boxShadows),
  ],
  sizes: [16, 32, 64, 128, 256],
  colors: {
    light: lightTheme.palette,
    dark: darkTheme.palette,
  },
}

interface ThemeContextValues {
  mode: string
  toggleMode: any
}

const ThemeContext = createContext<ThemeContextValues>({
  mode: '',
  toggleMode: () => {},
})

const ThemeProvider: FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const defaultTheme = React.useMemo(() => (prefersDarkMode ? darkTheme : lightTheme), [
    prefersDarkMode,
  ])

  const [theme, setTheme] = useState(defaultTheme)
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light')

  function toggleMode() {
    setMode(val => (val === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    if (mode === 'light') {
      setTheme(lightTheme)
    } else if (mode === 'dark') {
      setTheme(darkTheme)
    }
  }, [mode])

  useEffect(() => {
    console.log(`prefersDarkMode:`, prefersDarkMode)
    if (prefersDarkMode) {
      setMode('dark')
    } else {
      setMode('light')
    }
  }, [prefersDarkMode])

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
