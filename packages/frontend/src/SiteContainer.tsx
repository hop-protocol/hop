import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ThemeProvider from './theme/ThemeProvider'
import AppRoutes from './AppRoutes'

const useStyles = makeStyles(() => ({
  root: {
    padding: '4.2rem',
    backgroundColor: '#F0F0F3'
  }
}))

const SiteContainer: FC<{}> = () => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </div>
  )
}

export default SiteContainer