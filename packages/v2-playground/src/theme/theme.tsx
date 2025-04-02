import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

interface PaletteType {
  palette: {
    mode: 'dark' | 'light'
  }
}

enum ThemeMode {
  dark = 'dark',
  light = 'light',
}

type ThemeOrMode = ThemeMode | PaletteType

export function isDarkMode(themeOrMode?: ThemeOrMode): boolean {
  if (themeOrMode == null) {
    return false
  }

  if (typeof themeOrMode === 'string') {
    return themeOrMode === 'dark'
  }

  return themeOrMode.palette.mode === ThemeMode.dark
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#d56ec6',
    },
  },
})

export function CustomThemeProvider ({ children }: any) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
