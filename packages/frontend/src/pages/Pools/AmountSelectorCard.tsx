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
import { commafy } from 'src/utils'
import logger from 'src/logger'

const useStyles = makeStyles(theme => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      width: 'auto'
    }
  },
  topRow: {
    marginBottom: '1.8rem'
  },
  networkLabel: {},
  networkIcon: {
    height: '3.6rem'
  },
  greyCircle: {
    margin: '0.5rem',
    padding: '1.3rem',
    borderRadius: '1.8rem',
    backgroundColor: '#C4C4C4'
  },
  balance: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  maxButton: {
    border: 'none',
    background: '#f8f8f9',
    borderRadius: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1.2rem',
    marginRight: '1rem',
    cursor: 'pointer'
  }
}))

type Props = {
  value: string
  label: string
  title: string
  token?: Token
  onChange?: (value: string) => void
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
        try {
          const _balance = await user.getBalance(token, selectedNetwork)
          setBalance(ethersUtils.formatUnits(_balance.toString(), 18))
        } catch (err) {
          setBalance('')
          throw err
        }
      }
    }

    _getBalance().catch(logger.error)
  }, [user, token, selectedNetwork])

  useEffect(() => {
    getBalance()
  }, [getBalance, user, token, selectedNetwork])

  useInterval(() => {
    getBalance()
  }, 5e3)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (onChange) {
      onChange(value)
    }
  }
  const handleMaxClick = () => {
    if (onChange) {
      onChange(Number(balance).toFixed(2))
    }
  }

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
          <div className={styles.balance}>
            {Number(balance) > 0 ? (
              <button className={styles.maxButton} onClick={handleMaxClick}>
                MAX
              </button>
            ) : null}
            <Typography variant="subtitle2" color="textSecondary">
              Balance: {commafy(balance)}
            </Typography>
          </div>
        ) : null}
      </Box>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          {title}
        </Grid>
        <Grid item xs={8}>
          <LargeTextField
            value={value}
            onChange={handleInputChange}
            placeholder="0.0"
            units={token?.symbol}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default AmountSelectorCard
