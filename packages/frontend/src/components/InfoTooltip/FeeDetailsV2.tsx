import Box from '@mui/material/Box'
import React, { FC } from 'react'
import Typography from '@mui/material/Typography'
import { DetailRow } from '#components/InfoTooltip/DetailRow.js'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.padding.extraLight} !important`,
    width: '32.0rem !important',
  },
  text: {
    color: `${theme.palette.primary.contrastText} !important`,
    paddingBottom: `${theme.padding.extraLight} !important`,
  },
}))

type Props = {
  maxBonderFee: string
  maxBonderFeeUsd: string
  sendFee: string
  sendFeeUsd: string
  totalFeeUsd: string
}

export const FeeDetailsV2: FC<Props> = props => {
  const styles = useStyles()
  const { maxBonderFee, maxBonderFeeUsd, sendFee, sendFeeUsd, totalFeeUsd } = props

  return (
    <Box className={styles.root}>
      <Typography variant="body1" className={styles.text}>
        The total fee consists of the maximum bonder fee and the send fee.
      </Typography>

      <DetailRow
        title="Max Bonder Fee"
        value={<>
          {maxBonderFeeUsd && (
            <Box mr={0.5} display="inline-block" style={{ opacity: 0.6 }}><small>{maxBonderFeeUsd}</small></Box>
          )}
          <Box display="inline-block">{maxBonderFee}</Box>
        </>}
        contrastText
      />

      <DetailRow
        title="Send Fee"
        value={<>
          {sendFeeUsd && (
            <Box mr={0.5} display="inline-block" style={{ opacity: 0.6 }}><small>{sendFeeUsd}</small></Box>
          )}
          <Box display="inline-block">{sendFee}</Box>
        </>}
        contrastText
      />

      <DetailRow
        title="Total Fee"
        value={<>
          <Box display="inline-block">{totalFeeUsd}</Box>
        </>}
        contrastText
      />
    </Box>
  )
}
