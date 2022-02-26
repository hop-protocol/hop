import React from 'react'
import 'src/App.css'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import AppRoutes from 'src/AppRoutes'
import Header from 'src/components/header/Header'
import Footer from 'src/components/footer/Footer'
import AccountDetails from 'src/components/accountDetails'
import TxConfirm from 'src/components/txConfirm/TxConfirm'
import bgImage from 'src/assets/circles-bg.svg'
import bgImageDark from 'src/assets/circles-bg-dark.svg'
import { useThemeMode } from './theme/ThemeProvider'

const useStyles = makeStyles(theme => ({
  app: {
    backgroundImage: ({ isDarkMode }: any) =>
      isDarkMode ? `url(${bgImageDark})` : `url(${bgImage})`,
    backgroundColor: theme.palette.background.default,
    backgroundSize: '120%',
    transition: 'background 0.15s ease-out',
  },
}))

function App() {
  const { isDarkMode } = useThemeMode()
  const styles = useStyles({ isDarkMode })

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh" className={styles.app}>
        <Header />
        <AccountDetails />
        <AppRoutes />
        <TxConfirm />
        <Footer />
      </Box>
    </>
  )
}

export default App
