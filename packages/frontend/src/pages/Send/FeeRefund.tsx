import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import InfoTooltip from 'src/components/InfoTooltip'
import { getTokenImage } from 'src/utils/tokens'

export const useStyles = makeStyles(theme => ({
  root: {
    background: 'white',
    padding: '1rem 2rem',
    marginBottom: '2rem',
    borderRadius: '50px'
  }
}))

export function FeeRefund (props: any) {
  const { title, tokenSymbol, tooltip, value } = props
  const styles = useStyles()
  const tokenImageUrl = getTokenImage(tokenSymbol)

  return (
   <Box display="flex" justifyContent="space-between" alignItems="center" className={styles.root}>
    <Box display="flex" alignItems="center">
      <Typography>
      {title}
      </Typography>
      {tooltip ? <InfoTooltip title={tooltip} /> : null}
    </Box>
    <Box display="flex" alignItems="center">
      <Box mr={1} display="flex">
        <Typography>
         +
        </Typography>
      </Box>
      {tokenImageUrl && (
        <Box mr={1} display="flex">
          <img width="22px" src={tokenImageUrl} alt={tokenSymbol} />
        </Box>
      )}
      <Box mr={2} display="flex">
        <Typography>
          {value}
        </Typography>
      </Box>
    </Box>
   </Box>
  )
}
