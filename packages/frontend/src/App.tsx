import React from 'react'
import 'src/App.css'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import AppRoutes from 'src/AppRoutes'
import Header from 'src/components/header/Header'
import Footer from 'src/components/footer/Footer'
import AccountDetails from 'src/components/accountDetails'
import TxConfirm from 'src/components/txConfirm/TxConfirm'
import styled from 'styled-components/macro'
import bgImage from 'src/assets/circles-bg.svg'
import bgImageDark from 'src/assets/circles-bg-dark.svg'
import { useThemeMode } from './theme/ThemeProvider'
import { isDarkMode } from './theme/theme'

const useStyles = makeStyles(theme => ({
  app: ({ mode }: any) => ({
    backgroundColor: isDarkMode(mode) ? '#272332' : '#FDF7F9',
  }),
  content: {
    padding: '4.2rem',
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      padding: '2.2rem',
    },
  },
}))

const Wrapper = styled.div<any>`
  background: ${({ mode }: any) => (isDarkMode(mode) ? `url(${bgImageDark})` : `url(${bgImage})`)};
  background-repeat: repeat-y;
  background-size: cover;
`

function App() {
  const { mode } = useThemeMode()
  const styles = useStyles({ mode })

  return (
    <Box display="flex" flexDirection="column" className={styles.app}>
      <Wrapper mode={mode}>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Header />
          <AccountDetails />
          <div className={styles.content}>
            <AppRoutes />
          </div>
          <TxConfirm />
          <Footer />
        </Box>
      </Wrapper>
    </Box>
  )
}

export default App
