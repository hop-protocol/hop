import '../styles/globals.css'
import { ThemeProvider } from '@mui/material/styles'
import { useTheme } from '../components/_useTheme'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const { theme, dark, toggleTheme } = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <Component theme={theme} dark={dark} toggleTheme={toggleTheme} { ...pageProps } />
    </ThemeProvider>
  )
}

export default MyApp
