import 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { palette as paletteLight } from './_light'
import { palette as paletteDark } from './_dark'

export const darkTheme = createTheme({
  palette: {
    ...paletteDark,
  },
})

export const lightTheme = createTheme({
  palette: {
    ...paletteLight,
  },
})

export const theme = lightTheme
