import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

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
