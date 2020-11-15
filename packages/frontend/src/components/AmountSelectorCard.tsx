import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import LargeTextField from '../components/LargeTextField'

const useStyles = makeStyles(() => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box'
  },
  topRow: {
    marginBottom: '1.8rem'
  }
}))

type Props = {}

const AmountSelectorCard: FC<Props> = () => {
  const styles = useStyles()

  return (
    <Card className={styles.root}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" className={styles.topRow}>
        <Typography variant="subtitle2" color="textSecondary">
          From
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Balance: 0.0
        </Typography>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <LargeTextField placeholder="0.0">
          0.0 ETH
        </LargeTextField>
      </Box>
    </Card>
  )
}

export default AmountSelectorCard