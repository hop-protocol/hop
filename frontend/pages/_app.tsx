import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { useTheme } from '../components/_useTheme'

function MyApp({ Component, pageProps }: AppProps) {
  const { theme, dark, toggleTheme } = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <Component theme={theme} dark={dark} toggleTheme={toggleTheme} { ...pageProps } />
    </ThemeProvider>
  )
}

export default MyApp
