import React, { useMemo, FC, ChangeEvent } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import { Token } from '@hop-protocol/sdk'
import clsx from 'clsx'
import LargeTextField from 'src/components/LargeTextField'
import { commafy, normalizeNumberInput } from 'src/utils'

const useStyles = makeStyles(theme => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      width: 'auto',
    },
  },
  topRow: {
    marginBottom: '1.8rem',
  },
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '0.4rem',
    overflow: 'hidden',
    textOverflow: 'clip',
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
  },
  networkIcon: {
    display: 'flex',
    height: '2.2rem',
    margin: '0.7rem',
  },
  balance: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxButton: {
    border: 'none',
    background: '#f8f8f9',
    borderRadius: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1.2rem',
    marginRight: '1rem',
    cursor: 'pointer',
  },
  container: {
    flexWrap: 'nowrap',
  },
  networkContainer: {
    width: '180px',
  },
  inputContainer: {},
}))

type Props = {
  value?: string
  label?: string
  loadingLabel?: boolean
  onChange?: (value: string) => void
  title?: string
  titleIconUrl?: string
  token?: Token
  balance?: BigNumber
  balanceLabel?: string
  loadingBalance?: boolean
  secondaryToken?: Token
  secondaryBalance?: BigNumber
  secondaryBalanceLabel?: string
  loadingSecondaryBalance?: boolean
  loadingValue?: boolean
  disableInput?: boolean
  hideSymbol?: boolean
  hideMaxButton?: boolean
  className?: string
  decimalPlaces?: number
}

const AmountSelectorCard: FC<Props> = props => {
  const {
    value = '',
    label,
    loadingLabel = false,
    onChange,
    title,
    titleIconUrl,
    token,
    balance,
    balanceLabel,
    loadingBalance = false,
    secondaryToken,
    secondaryBalance,
    secondaryBalanceLabel,
    loadingSecondaryBalance = false,
    loadingValue = false,
    disableInput = false,
    hideSymbol = false,
    hideMaxButton = false,
    decimalPlaces = 4,
    className,
  } = props
  const styles = useStyles()

  const balanceDisplay = useMemo(() => {
    let label: string = ''
    if (token && balance) {
      label = formatUnits(balance, token?.decimals)
      label = commafy(label, decimalPlaces)
    }
    return label
  }, [token, balance])

  const secondaryBalanceDisplay = useMemo(() => {
    let label: string = ''
    if (secondaryToken && secondaryBalance) {
      label = formatUnits(secondaryBalance, secondaryToken?.decimals)
      label = commafy(label, decimalPlaces)
    }
    return label
  }, [secondaryToken, secondaryBalance])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const normalizedValue = normalizeNumberInput(value)
    if (onChange) {
      onChange(normalizedValue)
    }
  }
  const handleMaxClick = () => {
    if (onChange) {
      let max = ''
      if (balance && token) {
        max = formatUnits(balance, token.decimals)
      }
      onChange(max)
    }
  }

  const handleSecondaryMaxClick = () => {
    if (onChange) {
      let max = ''
      if (secondaryBalance && secondaryToken) {
        max = formatUnits(secondaryBalance, secondaryToken.decimals)
      }
      onChange(max)
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
        {!!label && (
          <Typography variant="subtitle2" color="textSecondary">
            {loadingBalance ? <Skeleton variant="text" width="15.0rem"></Skeleton> : label}
          </Typography>
        )}
        {loadingSecondaryBalance ? (
          <Skeleton variant="text" width="15.0rem"></Skeleton>
        ) : secondaryBalance ? (
          <div className={styles.balance}>
            {!hideMaxButton && secondaryBalance.gt(0) && !disableInput ? (
              <button className={styles.maxButton} onClick={handleSecondaryMaxClick}>
                MAX
              </button>
            ) : null}
            <Typography variant="subtitle2" color="textSecondary">
              {secondaryBalanceLabel || 'Balance:'} {secondaryBalanceDisplay}
            </Typography>
          </div>
        ) : null}
        {loadingBalance ? (
          <Skeleton variant="text" width="15.0rem"></Skeleton>
        ) : balance ? (
          <div className={styles.balance}>
            {!hideMaxButton && balance.gt(0) && !disableInput ? (
              <button className={styles.maxButton} onClick={handleMaxClick}>
                MAX
              </button>
            ) : null}
            <Typography variant="subtitle2" color="textSecondary">
              {balanceLabel || 'Balance:'} {balanceDisplay}
            </Typography>
          </div>
        ) : null}
      </Box>
      <Grid container alignItems="center" className={styles.container}>
        <Grid item className={styles.networkContainer}>
          <Box className={styles.networkSelectionBox}>
            {titleIconUrl ? (
              <Box className={styles.networkIconContainer}>
                <img src={titleIconUrl} className={styles.networkIcon} alt={title} />
              </Box>
            ) : null}
            <Typography variant="subtitle2" className={styles.networkLabel}>
              {title}
            </Typography>
          </Box>
        </Grid>
        <Grid item className={styles.inputContainer}>
          <LargeTextField
            value={value}
            onChange={handleInputChange}
            placeholder="0.0"
            units={hideSymbol ? '' : token?.symbol}
            disabled={disableInput}
            loadingValue={loadingValue}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default AmountSelectorCard
