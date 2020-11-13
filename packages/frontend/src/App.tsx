import React from 'react'
import './App.css'
import { makeStyles } from '@material-ui/core/styles'
import AppRoutes from './AppRoutes'
import Header from './components/Header'

const useStyles = makeStyles(() => ({
  content: {
    padding: '4.2rem'
  }
}))

function App() {
  const styles = useStyles()

  return (
    <div className="App">
      <Header />
      <div className={styles.content}>
        <AppRoutes />
      </div>
    </div>
  )
}

export default App;
