import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
      <Header />
      <div className={styles.content}>
        <AppRoutes />
      </div>
    </div>
  )
}

export default SiteContainer