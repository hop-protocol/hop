import React, { FC } from 'react'
import { makeStyles } from '@mui/styles'
import { DetailRow } from 'src/components/InfoTooltip/DetailRow'
import { commafy } from 'src/utils'
import Box from '@mui/material/Box'

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.padding.extraLight,
    width: '32.0rem',
  },
}))

type Props = {
  rate?: number
  slippageTolerance?: number
  priceImpact?: number
  amountOutMinDisplay?: string
  amountOutMinUsdDisplay?: string
  transferTime?: string
}

export const AmmDetails: FC<Props> = props => {
  const styles = useStyles()
  const { rate, slippageTolerance, priceImpact, amountOutMinDisplay, amountOutMinUsdDisplay, transferTime } = props

  return (
    <div className={styles.root}>
      <DetailRow title="Rate" value={rate === 0 ? '-' : commafy(rate, 4)} contrastText />
      <DetailRow
        title="Slippage Tolerance"
        value={slippageTolerance ? `${slippageTolerance}%` : undefined}
        contrastText
      />
      <DetailRow
        title="Price Impact"
        value={
          !priceImpact ? undefined : priceImpact < 0.01 ? '<0.01%' : `${commafy(priceImpact)}%`
        }
        contrastText
      />
      <DetailRow title="Minimum received" value={<>
        {!!amountOutMinUsdDisplay && (
          <Box mr={0.5} display="inline-block" style={{ opacity: 0.6 }}><small>{amountOutMinUsdDisplay}</small></Box>
        )}
        <Box display="inline-block">{amountOutMinDisplay}</Box>
      </>} contrastText />
      {!!transferTime && (
        <DetailRow title="Transfer Time" value={transferTime} contrastText />
      )}
    </div>
  )
}
