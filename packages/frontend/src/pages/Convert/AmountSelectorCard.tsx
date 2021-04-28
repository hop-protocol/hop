import React, {
  FC,
  ChangeEvent,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import clsx from 'clsx'
import { utils as ethersUtils } from 'ethers'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import LargeTextField from 'src/components/LargeTextField'
import FlatSelect from 'src/components/selects/FlatSelect'
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
  networkLabel: {
    marginLeft: theme.padding.extraLight,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  networkIcon: {
    height: '2.6rem',
    margin: '0.5rem'
  },
  greyCircle: {
    padding: '1.8rem',
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
  networkOptions?: Network[]
  onNetworkChange?: (network?: Network) => void
  onBalanceChange?: (balance: number | null) => void
  className?: string
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
    className
  } = props
  const styles = useStyles()
  const { user } = useApp()

  const [balance, setBalance] = useState<string | null>(null)
  // request debouncer so only latest request response is set
  const debouncer = useRef<number>(0)

  useEffect(() => {
    if (onBalanceChange) {
      onBalanceChange(Number(balance))
    }
  }, [balance])

  const getBalance = useCallback(() => {
    const ctx = debouncer.current
    const _getBalance = async () => {
      if (user && token && selectedNetwork) {
        try {
          const _balance = await user.getBalance(token, selectedNetwork)
          if (ctx === debouncer.current) {
            setBalance(
              ethersUtils.formatUnits(_balance.toString(), token.decimals)
            )
          }
        } catch (err) {
          setBalance(null)
          throw err
        }
      }
    }

    _getBalance().catch(logger.error)
  }, [user, token, selectedNetwork])

  useEffect(() => {
    // switching tabs will cause getBalance to be called with incorrect token
    // so we wait until there's no more switching to get balance
    debouncer.current++
    setBalance(null)
    const t = setTimeout(() => {
      getBalance()
    }, 10)
    return () => {
      clearTimeout(t)
    }
  }, [selectedNetwork])

  useEffect(() => {
    getBalance()
  }, [getBalance, user, token, selectedNetwork, debouncer.current])

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
    <Card className={clsx(styles.root, className)}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        className={styles.topRow}
      >
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        <div className={styles.balance}>
          {Number(balance) > 0 ? (
            <button className={styles.maxButton} onClick={handleMaxClick}>
              MAX
            </button>
          ) : null}
          <Typography variant="subtitle2" color="textSecondary">
            Balance:{' '}
            {!user ? (
              '0.00'
            ) : balance === null ? (
              <CircularProgress size={12} />
            ) : (
              commafy(balance)
            )}
          </Typography>
        </div>
      </Box>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <FlatSelect
            value={selectedNetwork?.slug || 'default'}
            onChange={event => {
              const network = networkOptions?.find(
                _network => _network.slug === event.target.value
              )
              if (onNetworkChange) {
                onNetworkChange(network)
              }
            }}
          >
            {networkOptions && (
              <MenuItem value="default" key={'select-network'}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <div className={styles.greyCircle} />
                  <Typography
                    variant="subtitle2"
                    className={styles.networkLabel}
                  >
                    Select Network
                  </Typography>
                </Box>
              </MenuItem>
            )}
            {(networkOptions || [selectedNetwork])?.map(
              (network: Network | undefined, i: number) => (
                <MenuItem value={network?.slug} key={i}>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <img
                      src={network?.imageUrl}
                      className={styles.networkIcon}
                      alt={network?.name}
                    />
                    <Typography
                      variant="subtitle2"
                      className={styles.networkLabel}
                    >
                      {network?.name}
                    </Typography>
                  </Box>
                </MenuItem>
              )
            )}
          </FlatSelect>
        </Grid>
        <Grid item xs={6}>
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
