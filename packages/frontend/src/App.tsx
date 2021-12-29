import React from 'react'
import 'src/App.css'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import AppRoutes from 'src/AppRoutes'
import Header from 'src/components/header/Header'
import Footer from 'src/components/footer/Footer'
import AccountDetails from 'src/components/accountDetails'
import TxConfirm from 'src/components/txConfirm/TxConfirm'
import styled from 'styled-components/macro'
import bgImage from 'src/assets/circles-bg.svg'
import bgImageDark from 'src/assets/circles-bg-dark.svg'
import { isDarkMode } from './theme/theme'

const useStyles = makeStyles(theme => ({
  app: {
    backgroundColor: theme.palette.background.default,
    backgroundPositionY: '50px',
    background: isDarkMode(theme) ? `url(${bgImageDark})` : `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    transition: 'background 0.15s ease-out',
  },
  content: {
    padding: '2.5rem',
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      padding: '2.2rem',
    },
  },
}))

function App() {
  const theme = useTheme()
  const styles = useStyles()

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh" className={styles.app}>
        <Header />
        <AccountDetails />
        <div className={styles.content}>
          <AppRoutes />
        </div>
        <TxConfirm />
        <Footer />
      </Box>
    </>
  )
}

export default App
