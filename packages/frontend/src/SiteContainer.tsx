import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ThemeProvider from './theme/ThemeProvider'
import AppRoutes from './AppRoutes'
import Header from './components/Header'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#F0F0F3'
  },
  content: {
    padding: '4.2rem'
  }
}))

const SiteContainer: FC<{}> = () => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <ThemeProvider>
        <Header />
        <div className={styles.content}>
          <AppRoutes />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default SiteContainer