import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import InfoTooltip from 'src/components/InfoTooltip'
import { getTokenImage } from 'src/utils/tokens'

export const useStyles = makeStyles(theme => ({
  root: {
    width: '47rem',
    background: 'white',
    padding: '1rem 2rem',
    marginBottom: '2rem',
    marginLeft: '-20px',
    borderRadius: '50px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    }
  }
}))

export function FeeRefund (props: any) {
  const { title, tokenSymbol, tooltip, value } = props
  const styles = useStyles()
  const tokenImageUrl = getTokenImage(tokenSymbol)

  return (
   <Box display="flex" justifyContent="space-between" alignItems="center" className={styles.root}>
    <Box display="flex" alignItems="center">
      <Typography variant="subtitle1" color="textSecondary" style={{
        display: 'flex',
        alignItems: 'center'
      }}>
      <div>{title}</div>
      {tooltip ? <InfoTooltip title={tooltip} /> : null}
      </Typography>
    </Box>
    <Box display="flex" alignItems="center">
      <Box mr={1} display="flex">
        <Typography variant="subtitle1" color="textSecondary">
         +
        </Typography>
      </Box>
      {tokenImageUrl && (
        <Box mr={1} display="flex">
          <img width="22px" src={tokenImageUrl} alt={tokenSymbol} />
        </Box>
      )}
      <Box display="flex">
        <Typography variant="subtitle1" color="textSecondary">
          {value}
        </Typography>
      </Box>
    </Box>
   </Box>
  )
}
