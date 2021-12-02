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
  },
  content: {
    padding: '4.2rem',
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      padding: '2.2rem',
    },
  },
}))

const Circles = styled.div<any>`
  background: ${({ mode }: any) => (isDarkMode(mode) ? `url(${bgImageDark})` : `url(${bgImage})`)};
  background-repeat: repeat-y;
  background-size: cover;
`

function App() {
  const theme = useTheme()
  const styles = useStyles()

  return (
    <Box display="flex" flexDirection="column" className={styles.app}>
      <Circles mode={theme.palette.type}>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Header />
          <AccountDetails />
          <div className={styles.content}>
            <AppRoutes />
          </div>
          <TxConfirm />
          <Footer />
        </Box>
      </Circles>
    </Box>
  )
}

export default App
