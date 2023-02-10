import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core'
import { DetailRow } from 'src/components/InfoTooltip'
import { commafy } from 'src/utils'

const useStyles = makeStyles(theme => ({
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
  transferTime?: string
}

const AmmDetails: FC<Props> = props => {
  const styles = useStyles()
  const { rate, slippageTolerance, priceImpact, amountOutMinDisplay, transferTime } = props

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
      <DetailRow title="Minimum received" value={amountOutMinDisplay} contrastText />
      {!!transferTime && (
        <DetailRow title="Transfer Time" value={transferTime} contrastText />
      )}
    </div>
  )
}

export default AmmDetails
