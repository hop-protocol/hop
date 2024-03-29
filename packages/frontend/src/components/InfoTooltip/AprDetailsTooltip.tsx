import Box from '@mui/material/Box'
import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.padding.extraLight,
    width: '22rem',
  },
  image: {
    width: '20px'
  },
  text: {
    color: theme.palette.primary.contrastText
  },
}))

export function AprDetailsTooltip (props: any) {
  const styles = useStyles()
  const { total, tradingFees, rewards, children } = props

  return (
    <Tooltip
      placement={'top'}
      arrow={true}
      title={
        <div className={styles.root}>
          <Box mb={1}>
            <Typography variant="subtitle2" className={styles.text} component="div">
              <span style={{ fontWeight: 'normal' }}>Total APR</span> <strong>{total.aprFormatted}</strong>
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="subtitle2" className={styles.text} component="div">
              <span style={{ fontWeight: 'normal' }}>Trading Fees</span> <strong>{tradingFees.aprFormatted}</strong>
            </Typography>
          </Box>
          {/* TODO: Replace with automated LSD data in stats-worker */}
          {(rewards?.length > 0 && rewards?.[0]?.rewardTokenSymbol === 'ETH') && (
          <Box mb={1}>
            <Typography variant="subtitle2" className={styles.text} component="div">
              <span style={{ fontWeight: 'normal' }}>rETH APR</span> <strong>{rewards?.[0].aprFormatted}</strong>
            </Typography>
          </Box>
          )}
          {rewards?.length > 0 && (
          <Box mb={1} display="flex">
            <Box mb={1}>
              <Typography variant="subtitle2" className={styles.text} component="div">
                <span style={{ fontWeight: 'normal' }}>Rewards</span>
              </Typography>
            </Box>
            <Box ml={1}>
              {rewards?.map((x: any, i: number) => {
                // TODO: Replace with automated LSD data in stats-worker
                if (x.rewardTokenSymbol === 'ETH') return null
                return (
                  <Box key={i}>
                    {(i > 0 && (x.rewardTokenSymbol !== 'RPL')) && (
                      <Box mb={1} display="flex" justifyContent="center">
                        <Typography variant="subtitle2" className={styles.text}>
                          <span style={{ fontWeight: 'normal' }}>or</span>
                        </Typography>
                      </Box>
                    )}
                    <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                      {!!x.rewardTokenImageUrl && (
                        <Box className={styles.image} mr={0.5} display="flex" justifyContent="center">
                          <img src={x.rewardTokenImageUrl} alt={x.rewardTokenSymbol} width="100%" />
                        </Box>
                      )}
                      <Typography variant="subtitle2" className={styles.text}>
                        <strong>{x.rewardTokenSymbol} {x.aprFormatted}</strong>
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
          )}
        </div>
    }
    >
      {children}
    </Tooltip>
  )
}
