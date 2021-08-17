import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DetailRow from 'src/components/DetailRow'
import { commafy } from 'src/utils'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.padding.extraLight,
    width: '32.0rem'
  }
}))

type Props = {
  rate: number | undefined
  slippageTolerance: number | undefined
  priceImpact: number | undefined
  amountOutMinDisplay: string | undefined
}

const AmmDetails: FC<Props> = props => {
  const styles = useStyles()
  const {
    rate,
    slippageTolerance,
    priceImpact,
    amountOutMinDisplay
  } = props

  return (
    <div className={styles.root}>
      <DetailRow
        title="Rate"
        value={rate === 0 ? '-' : commafy(rate, 4)}
        contrastText
      />
      <DetailRow
        title="Slippage Tolerance"
        value={slippageTolerance ? `${slippageTolerance}%` : undefined}
        contrastText
      />
      <DetailRow
        title="Price Impact"
        value={
          !priceImpact
            ? undefined
            : priceImpact < 0.01
              ? '<0.01%'
              : `${commafy(priceImpact)}%`
        }
        contrastText
      />
      <DetailRow
        title="Minimum received"
        value={amountOutMinDisplay}
        contrastText
      />
    </div>
  )
}

export default AmmDetails
