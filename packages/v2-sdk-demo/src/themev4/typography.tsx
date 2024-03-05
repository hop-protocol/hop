import { TypographyOptions } from '@mui/material/styles/createTypography'

export const typographyOptions: TypographyOptions = {
  fontFamily: [
    'Nunito',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontSize: '8.2rem',
    fontWeight: 300,
  },
  h2: {
    fontSize: '6.0rem',
    fontWeight: 300,
  },
  h3: {
    fontSize: '4.1rem',
    fontWeight: 400,
  },
  h4: {
    fontSize: '2.7rem',
    fontWeight: 700,
  },
  h5: {
    fontSize: '2.4rem',
    fontWeight: 700,
  },
  h6: {
    fontSize: '2.0rem',
    fontWeight: 700,
  },
  subtitle1: {
    fontSize: '1.8rem',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: '1.6rem',
    fontWeight: 700,
  },
  body1: {
    fontSize: '1.4rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '1.2rem',
    fontWeight: 400,
  },
  button: {
    fontSize: '1.8rem',
    fontWeight: 700,
    textTransform: 'capitalize',
  },
}
