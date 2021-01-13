import React, { FC, ChangeEvent, useState, useEffect, useCallback } from 'react'
import { utils as ethersUtils } from 'ethers'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LargeTextField from 'src/components/LargeTextField'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { useApp } from 'src/contexts/AppContext'
import useInterval from 'src/hooks/useInterval'

const useStyles = makeStyles(theme => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box'
  },
  topRow: {
    marginBottom: '1.8rem'
  },
  networkLabel: {
    marginLeft: theme.padding.extraLight
  },
  networkIcon: {
    height: '3.6rem'
  },
  greyCircle: {
    padding: '1.8rem',
    borderRadius: '1.8rem',
    backgroundColor: '#C4C4C4'
  }
}))

type Props = {
  value: string
  label: string
  title: string
  token?: Token
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  selectedNetwork?: Network
  onBalanceChange?: (balance: number) => void
}

const AmountSelectorCard: FC<Props> = props => {
  const {
    value,
    label,
    title,
    token,
    onChange,
    selectedNetwork,
    onBalanceChange
  } = props
  const styles = useStyles()
  const { user } = useApp()

  const [balance, setBalance] = useState('0.00')

  useEffect(() => {
    if (onBalanceChange) {
      onBalanceChange(Number(balance))
    }
  }, [balance])

  const getBalance = useCallback(() => {
    const _getBalance = async () => {
      if (user && token && selectedNetwork) {
        const _balance = await user.getBalance(token, selectedNetwork)
        setBalance(Number(ethersUtils.formatUnits(_balance, 18)).toFixed(2))
      }
    }

    _getBalance()
  }, [user, token, selectedNetwork])

  useEffect(() => {
    getBalance()
  }, [getBalance, user, token, selectedNetwork])

  useInterval(() => {
    getBalance()
  }, 5e3)

  return (
    <Card className={styles.root}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        className={styles.topRow}
      >
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        {balance ? (
          <Typography variant="subtitle2" color="textSecondary">
            Balance: {balance}
          </Typography>
        ) : null}
      </Box>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          {title}
        </Grid>
        <Grid item xs={6}>
          <LargeTextField
            value={value}
            onChange={onChange}
            placeholder="0.0"
            units={token?.symbol}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default AmountSelectorCard
