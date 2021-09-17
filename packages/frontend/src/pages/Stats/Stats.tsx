import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import PoolStats from './PoolStats'
import BonderStats from './BonderStats'
import PendingAmountStats from './PendingAmountStats'
import BalanceStats from './BalanceStats'

const useStyles = makeStyles(theme => ({
  stats: {
    marginBottom: '2rem'
  },
}))

const Stats: FC = () => {
  const styles = useStyles()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <div className={styles.stats}>
        <PoolStats />
      </div>
      <div className={styles.stats}>
        <PendingAmountStats />
      </div>
      <div className={styles.stats}>
        <BonderStats />
      </div>
      <div className={styles.stats}>
        <BalanceStats />
      </div>
    </Box>
  )
}

export default Stats
