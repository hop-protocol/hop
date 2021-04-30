import React, { FC, ChangeEvent, useState, useEffect, useCallback } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Skeleton from '@material-ui/lab/Skeleton'
import LargeTextField from 'src/components/LargeTextField'
import FlatSelect from 'src/components/selects/FlatSelect'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { useApp } from 'src/contexts/AppContext'
import { commafy } from 'src/utils'
import useBalance from 'src/pages/Send/useBalance'

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
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '0.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem'
  },
  networkIcon: {
    display: 'flex',
    height: '2.6rem',
    margin: '0.5rem'
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
  token?: Token
  onChange?: (value: string) => void
  selectedNetwork?: Network
  networkOptions: Network[]
  onNetworkChange: (network?: Network) => void
  onBalanceChange?: (balance: number) => void
  disableInput?: boolean
}

const AmountSelectorCard: FC<Props> = props => {
  const {
    value,
    label,
    token,
    onChange,
    selectedNetwork,
    networkOptions,
    onNetworkChange,
    onBalanceChange,
    disableInput = false
  } = props
  const styles = useStyles()
  const { user } = useApp()

  const { balance, loadingBalance } = useBalance(token, selectedNetwork)


  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (onChange) {
      onChange(value)
    }
  }
  const handleMaxClick = () => {
    if (onChange) {
      onChange(Number(balance).toString())
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
        {
          loadingBalance
          ? <Skeleton variant="text" width="15.0rem"></Skeleton>
          : balance
          ? (
            <div className={styles.balance}>
              {Number(balance) > 0 && !disableInput ? (
                <button className={styles.maxButton} onClick={handleMaxClick}>
                  MAX
                </button>
              ) : null}
              <Typography variant="subtitle2" color="textSecondary">
                Balance: {commafy(balance)}
              </Typography>
            </div>
          )
          : null
        }
      </Box>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <FlatSelect
            value={selectedNetwork?.slug || 'default'}
            onChange={event => {
              const network = networkOptions.find(
                _network => _network.slug === event.target.value
              )
              onNetworkChange(network)
            }}
          >
            <MenuItem value="default">
              <Box display="flex" flexDirection="row" alignItems="center">
                <div className={styles.greyCircle} />
                <Typography variant="subtitle2" className={styles.networkLabel}>
                  Select Network
                </Typography>
              </Box>
            </MenuItem>
            {networkOptions.map(network => (
              <MenuItem value={network.slug} key={network.slug}>
                <Box className={styles.networkSelectionBox}>
                  <Box className={styles.networkIconContainer}>
                    <img
                      src={network.imageUrl}
                      className={styles.networkIcon}
                      alt={network.name}
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    className={styles.networkLabel}
                  >
                    {network.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </FlatSelect>
        </Grid>
        <Grid item xs={6}>
          <LargeTextField
            value={value}
            onChange={handleInputChange}
            placeholder="0.0"
            units={token?.symbol}
            disabled={disableInput}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default AmountSelectorCard
