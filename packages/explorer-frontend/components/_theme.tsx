import 'react'
import { createTheme } from '@mui/material/styles'
import { palette as paletteDark } from './_dark'
import { palette as paletteLight } from './_light'

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
