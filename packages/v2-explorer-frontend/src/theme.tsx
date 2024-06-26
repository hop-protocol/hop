import 'react'
import { createTheme } from '@mui/material/styles'

export const paletteLight = {
  primary: {
    light: '#c462fc',
    main: '#B32EFF',
    dark: '#7213a8',
    contrastText: 'white',
  },
  background: {
    default: '#FDF7F9',
    paper: '#FFFFFF',
    contrast: '#FFFFFF',
  },
  action: {
    active: '#B32EFF',
    hover: '#e8c1ff',
    selected: '#B32EFF',
    disabled: 'white',
  },
  secondary: {
    main: '#666077',
    light: '#6660777f',
  },
  success: {
    main: '#00a72f',
    light: '#00a72f33',
  },
  error: {
    main: '#c50602',
    light: '#c506021e',
  },
  info: {
    main: '#2172e5',
    light: '#2172e51e',
  },
  text: {
    primary: '#0F0524',
    secondary: '#666077',
    disabled: '#6660777f',
  },
  table: {
    hover: '#c5c5c533'
  }
}

export const paletteDark = {
  primary: {
    light: '#c462fc',
    main: '#B32EFF',
    dark: '#7213a8',
    contrastText: 'white',
  },
  background: {
    default: '#272332',
    paper: '#272332',
    contrast: '#1F1E23',
  },
  action: {
    active: '#B32EFF',
    hover: '#af64c5',
    selected: '#B32EFF',
    disabled: '#66607738',
  },
  secondary: {
    main: '#968FA8',
    light: '#968FA87f',
  },
  success: {
    main: '#00a72f',
    light: '#00a72f33',
  },
  error: {
    main: '#c50602',
    light: '#c506021e',
  },
  info: {
    main: '#2172e5',
    light: '#2172e51e',
  },
  text: {
    primary: '#E3DDF1',
    secondary: '#968FA8',
    disabled: '#968FA87f',
  },
  table: {
    hover: '#00000033'
  }
}

const common = {
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: paletteLight.secondary.main, // Default border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: paletteLight.primary.dark, // Border color on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: paletteLight.primary.light, // Border color when focused
          },
        },
      },
    },
  },
}

export const darkTheme = createTheme({
  palette: {
    ...paletteDark,
  },
  ...common,
})

export const lightTheme = createTheme({
  palette: {
    ...paletteLight,
  },
  ...common,
})

export const theme = lightTheme
