import React, { ChangeEvent } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { BigNumber } from 'ethers'
import { Link } from 'react-router-dom'
import { sanitizeNumericalString } from 'src/utils'
import { useStyles } from '../PoolDetails/useStyles'

type Props = {
  balanceFormatted: string
  balanceBn?: BigNumber
  label: string
  onClick?: any
}

export function BalanceText(props: Props) {
  const styles = useStyles()
  const { label, balanceFormatted, balanceBn, onClick } = props

  function handleClick (event: ChangeEvent<{}>) {
    event.preventDefault()
    if (onClick) {
      const value = balanceBn ?? sanitizeNumericalString(balanceFormatted)
      onClick(value)
    }
  }

  const text = (
    <Typography variant="body2" color="secondary">
      <strong>{label || 'Balance'}: {balanceFormatted}</strong>
    </Typography>
  )

  const showLink = !!onClick
  if (showLink) {
    return (
      <Box>
        <Link to="" onClick={handleClick} className={styles.balanceLink}>
          {text}
        </Link>
      </Box>
    )
  }

  return (
    <Box>
      {text}
    </Box>
  )
}
