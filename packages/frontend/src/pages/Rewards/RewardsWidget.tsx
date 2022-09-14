import React from 'react'
import Alert from 'src/components/alert/Alert'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import Button from 'src/components/buttons/Button'
import Typography from '@material-ui/core/Typography'
import { toTokenDisplay } from 'src/utils'
import InfoTooltip from 'src/components/InfoTooltip'
import { useRewards } from './useRewards'
import { Circle } from 'src/components/ui'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  rewardsContractAddress: string
  merkleBaseUrl: string
  requiredChainId: number
  title: string
}

export const useStyles = makeStyles(theme => ({
  box: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    minHeight: '200px',
  },
  root: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center'
    },
  }
}))

export function RewardsWidget(props: Props) {
  const styles = useStyles()
  const { rewardsContractAddress, merkleBaseUrl, requiredChainId, title } = props
  const { tokenDecimals, tokenSymbol, claimableAmount, unclaimableAmount, latestRootTotal, latestRoot, claimRecipient, error, onchainRoot, loading, claim, claiming, estimatedDate, claimChain, txHistoryLink } = useRewards({ rewardsContractAddress, merkleBaseUrl, requiredChainId })

  const claimableAmountDisplay = tokenDecimals ? Number(toTokenDisplay(claimableAmount, tokenDecimals)).toFixed(2) : ''
  const unclaimableAmountDisplay = tokenDecimals ? Number(toTokenDisplay(unclaimableAmount, tokenDecimals)).toFixed(2) : ''
  const latestRootTotalDisplay = tokenDecimals ? toTokenDisplay(latestRootTotal, tokenDecimals) : ''

  return (
    <Box maxWidth="640px" margin="0 auto" flexDirection="column" display="flex" justifyContent="center" textAlign="center">
      {!claimRecipient && (
        <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
          <Typography variant="body1">
            Please connect wallet
          </Typography>
        </Box>
      )}
      {!!claimRecipient && (
        <Box>
          <Box mb={4} flexDirection="column" textAlign="left">
            <Typography variant="h5">{title} <InfoTooltip title={<><div>Merkle rewards</div><div>published root: {onchainRoot}</div><div>Latest root: {latestRoot}</div><div>latest root total: {latestRootTotalDisplay}</div></>} /></Typography>
          </Box>
          {loading && (
            <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
              <Typography variant="body1">
                Loading...
              </Typography>
            </Box>
          )}
          <Box display="flex" justifyContent="space-between" className={styles.root}>
            <Box mb={4} display="flex" flexDirection="column" textAlign="left" width="300px">
              <Card className={styles.box}>
                <Box mb={4}>
                  <Box mb={2}>
                    <Typography variant="h6">
                      Claimable {tokenSymbol} <InfoTooltip title={'Tokens that can be claimed now'} />
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle1">
                      {claimChain && (
                      <Circle style={{
                        width: '32px',
                        height: '32px',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginRight: '1rem'
                      }}>
                        <img src={claimChain.imageUrl} alt={claimChain.name} title={claimChain.name} width="100%" />
                      </Circle>
                      )}
                      {claimableAmountDisplay} {tokenSymbol}
                    </Typography>
                  </Box>
                </Box>
                <Box mb={2}>
                  <Button variant="contained" onClick={claim} loading={claiming} disabled={claiming || claimableAmount.eq(0)} highlighted={claimableAmount.gt(0)} fullWidth large>Claim</Button>
                </Box>
              </Card>
            </Box>
            <Box mb={4} display="flex" flexDirection="column" textAlign="left" width="300px">
              <Card className={styles.box}>
                <Box mb={4}>
                  <Box mb={2}>
                    <Typography variant="h6">
                      Pending {tokenSymbol} <InfoTooltip title={'Tokens that will be claimable once merkle root is published on-chain'} />
                    </Typography>
                  </Box>
                  <Box mb={2} display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1">
                        {claimChain && (
                          <Circle style={{
                            width: '32px',
                            height: '32px',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            marginRight: '1rem'
                          }}>
                            <img src={claimChain.imageUrl} alt={claimChain.name} title={claimChain.name} width="100%" />
                          </Circle>
                        )}
                        {unclaimableAmountDisplay} {tokenSymbol}
                      </Typography>
                    </Box>
                    {!!unclaimableAmountDisplay && (
                      <Box>
                        <Box>
                          <Typography variant="body1">
                            <strong>Countdown</strong>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body1">
                            {estimatedDate}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box mb={2}>
                  <Button variant="contained" href={txHistoryLink} fullWidth large target="_blank" rel="noopener noreferrer">Tx History →</Button>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      )}
      {!!error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  )
}
