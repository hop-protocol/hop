import React from 'react'
import 'src/App.css'
import { makeStyles } from '@material-ui/core/styles'
import AppRoutes from 'src/AppRoutes'
import Header from 'src/components/Header'
import AccountDetails from 'src/components/accountDetails'
import TxConfirm from 'src/components/txConfirm/TxConfirm'

const useStyles = makeStyles(theme => ({
  content: {
    padding: '4.2rem',
    [theme.breakpoints.down('xs')]: {
      padding: '2.2rem'
    }
  }
}))

function App () {
  const styles = useStyles()

  return (
    <div className="App">
      <Header />
      <AccountDetails />
      <div className={styles.content}>
        <AppRoutes />
      </div>
      <TxConfirm />
    </div>
  )
}

export default App
