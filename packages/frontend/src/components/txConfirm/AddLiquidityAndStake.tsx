import React from 'react'
import Button from 'src/components/buttons/Button'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
  root: {
  },
  title: {
  },
  action: {},
  sendButton: {},
}))

interface Props {
  onConfirm: (confirmed: boolean, opts: any) => void
}

export function AddLiquidityAndStake (props: Props) {
  const { onConfirm } = props
  const styles = useStyles()

  function handleDepositAndStake() {
    onConfirm(true, { stake: true })
  }

  function handleDeposit() {
    onConfirm(true, { stake: false })
  }

  return (
    <Box className={styles.root}>
      <Box className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Confirm Add Liquidity
        </Typography>
      </Box>
      <Box className={styles.action}>
        <Button
          className={styles.sendButton}
          onClick={handleDepositAndStake}
          large
          highlighted
        >
          Deposit + Stake
        </Button>
      </Box>
      <Box className={styles.action}>
        <Button
          className={styles.sendButton}
          onClick={handleDeposit}
          large
          highlighted
        >
          Deposit
        </Button>
      </Box>
    </Box>
  )
}
