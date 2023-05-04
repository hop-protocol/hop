import { TypographyOptions } from '@material-ui/core/styles/createTypography'

export const typographyOptions: TypographyOptions = {
  fontFamily: [
    'Inter',
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
    fontSize: '24px',
    fontWeight: 600,
  },
  h2: {
    fontSize: '22px',
    fontWeight: 600,
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
  },
  h4: {
    fontSize: '18px',
    fontWeight: 400,
  },
  h5: {
    fontSize: '16px',
    fontWeight: 400,
  },
  h6: {
    fontSize: '14px',
    fontWeight: 400,
  },
  subtitle1: {
    fontSize: '16px',
    fontWeight: 600,
  },
  subtitle2: {
    fontSize: '14px',
    fontWeight: 600,
  },
  body1: {
    fontSize: '16px',
    fontWeight: 400,
  },
  body2: {
    fontSize: '14px',
    fontWeight: 400,
  },
  button: {
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
}
