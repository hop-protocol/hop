import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  )
}

export default MyApp
