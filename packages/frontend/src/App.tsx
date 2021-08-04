import React from 'react'
import 'src/App.css'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import AppRoutes from 'src/AppRoutes'
import Header from 'src/components/header/Header'
import Footer from 'src/components/footer/Footer'
import AccountDetails from 'src/components/accountDetails'
import TxConfirm from 'src/components/txConfirm/TxConfirm'

const useStyles = makeStyles(theme => ({
  app: {
    minHeight: '100vh'
  },
  content: {
    padding: '4.2rem',
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      padding: '2.2rem'
    }
  }
}))

function App () {
  const styles = useStyles()

  return (
    <Box display="flex" flexDirection="column" className={styles.app}>
      <Header />
      <AccountDetails />
      <div className={styles.content}>
        <AppRoutes />
      </div>
      <TxConfirm />
      <Footer />
    </Box>
  )
}

export default App
