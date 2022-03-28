import React, { createContext, FC, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, Theme } from '@material-ui/core/styles'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme'
import { useLocalStorage } from 'react-use'
import { Theme as StyledSystemTheme } from 'styled-system'
import { paletteDark, paletteLight } from './overrides'
import get from 'lodash/get'
import merge from 'lodash/merge'

const shadows = {
  top: `
    5px -5px 10px #666077b5,
    -5px 5px 10px rgba(11, 9, 30, 0.6)`,
  bottom: `
    5px -5px 10px #FFFFFF,
    -5px 5px 10px #66607733`,
  innerLight: `
    inset 4px -4px 3px #FFFFFF,
    inset 8px -8px 60px -5px #F1E9EC,
    inset -7px 7px 5px -4px rgba(174, 174, 192, 0.4)`,
  innerDark: `
    inset -8px -8px 60px -5px rgba(21, 20, 29, 0.6),
    inset 4px -4px 3px rgba(102, 96, 119, 0.5),
    inset -7px 7px 5px -4px #161222`,
  mutedDark: `
    0px 4px 25px 10px rgba(255, 255, 255, 0.01)`,
}

type CustomColors = Omit<StyledSystemTheme, 'colors'> & {
  colors?: any
}

const breakpoints: any = ['600px', '960px', '1280px', '1920px']

breakpoints.sm = breakpoints[0]
breakpoints.md = breakpoints[1]
breakpoints.lg = breakpoints[2]
breakpoints.xl = breakpoints[3]

export const styledSystemTheme: CustomColors = {
  // 640px, 832px, 1024px, 1440px
  // '40em', '52em', '64em', '90em'
  // breakpoints: ['640px', '832px', '1024px', '1440px'],
  breakpoints,
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
  shadows: {
    none: 'none',
    ...shadows,
  },
  sizes: [16, 32, 64, 128, 256],
  colors: {
    modes: {
      light: paletteLight,
      dark: paletteDark,
    },
    black: {
      muted: '#201E26',
    },
  },
  mediaQueries: {
    sm: `@media screen and (min-width: ${breakpoints.sm})`,
    md: `@media screen and (min-width: ${breakpoints.md})`,
    lg: `@media screen and (min-width: ${breakpoints.lg})`,
    xl: `@media screen and (min-width: ${breakpoints.xl})`,
  },
}

interface ThemeContextValues {
  mode?: string
  toggleMode: any
  theme: Theme
  ssTheme: any
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextValues>({
  mode: 'light',
  toggleMode: () => {},
  theme: lightTheme,
  ssTheme: styledSystemTheme,
  isDarkMode: false,
})

const getTheme = mode =>
  merge({}, styledSystemTheme, {
    colors: get(styledSystemTheme.colors.modes, mode, styledSystemTheme.colors),
  })

const cacheKey = 'ui-theme-mode'

const ThemeProvider: FC = ({ children }) => {
  const [mode, setMode] = useLocalStorage(cacheKey, 'light')
  const [theme, setTheme] = useState(mode === 'light' ? lightTheme : darkTheme)
  const ssTheme = getTheme(mode)

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
        theme,
        ssTheme,
        isDarkMode: mode === 'dark',
      }}
    >
      <MuiThemeProvider theme={theme}>
        <SCThemeProvider theme={ssTheme}>{children}</SCThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeMode = () => useContext(ThemeContext)

export default ThemeProvider
