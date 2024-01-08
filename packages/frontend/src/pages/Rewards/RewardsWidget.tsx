import React, { useState } from 'react'
import { Alert } from 'src/components/Alert'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import { Button } from 'src/components/Button'
import Typography from '@material-ui/core/Typography'
import { toTokenDisplay } from 'src/utils'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { useRewards } from 'src/pages/Rewards/useRewards'
import { makeStyles } from '@material-ui/core/styles'
import { LargeTextField } from 'src/components/LargeTextField'
import { utils } from 'ethers'

interface Props {
  rewardsContractAddress: string
  merkleBaseUrl: string
  requiredChainId: number
  title: string
  description: string
}

export const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center'
    },
  },
  box: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    minHeight: '200px',
  },
  header: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '450',
      display: 'flex',
      flexDirection: 'column'
    },
  }
}))

export function RewardsWidget(props: Props) {
  const styles = useStyles()
  const { rewardsContractAddress, merkleBaseUrl, requiredChainId, title, description } = props
  const { tokenDecimals, tokenSymbol, claimableAmount, unclaimableAmount, latestRootTotal, latestRoot, claimRecipient, error, onchainRoot, loading, claim, claiming, tokenImageUrl, txHistoryLink, repoUrl, countdown, inputValue, handleInputChange, withdrawn } = useRewards({ rewardsContractAddress, merkleBaseUrl, requiredChainId })

  const claimableAmountDisplay = tokenDecimals ? Number(toTokenDisplay(claimableAmount, tokenDecimals)).toFixed(2) : ''
  const unclaimableAmountDisplay = tokenDecimals ? Number(toTokenDisplay(unclaimableAmount, tokenDecimals)).toFixed(2) : ''
  const latestRootTotalDisplay = tokenDecimals ? toTokenDisplay(latestRootTotal, tokenDecimals) : ''
  const showCountdown = unclaimableAmount?.gt(0)

  const [showAddressChangeForm, setShowAddressChangeForm] = useState(false)

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
          <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" className={styles.header}>
            <Box flexDirection="column" textAlign="left">
              <Typography variant="h5" component="div">{title} <InfoTooltip title={<Box maxWidth="400px"><div>{description}</div><br /><div>Merkle rewards info</div><div>Published root: {onchainRoot}</div><div>Latest root: {latestRoot}</div><div>Latest root total: {latestRootTotalDisplay}</div><div>Github repo: {repoUrl}</div></Box>} /></Typography>
            </Box>
            {!showAddressChangeForm && (
              <Typography variant="body2" color="secondary" onClick={(event: any) => {
                event.preventDefault()
                setShowAddressChangeForm(true)
              }} style={{ cursor: 'pointer' }}>
                Change address
              </Typography>
            )}
          </Box>


          {loading && (
            <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
              <Typography variant="body1">
                Loading...
              </Typography>
            </Box>
          )}

          {showAddressChangeForm && (
            <Box mb={6}>
              <Card>
                <Typography variant="body1">
                  Enter account address to claim for them
                </Typography>
                <LargeTextField
                  leftAlign
                  fullWidth
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter address (e.g. 0x123...)"
                  smallFontSize
                />
              </Card>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" className={styles.root}>
            <Box mb={4} display="flex" flexDirection="column" textAlign="left" width="300px">
              <Card className={styles.box}>
                <Box mb={4}>
                  <Box mb={2}>
                    <Typography variant="h6" component="div">
                      Claimable {tokenSymbol} <InfoTooltip title={'Tokens that can be claimed now'} />
                    </Typography>
                  </Box>
                  <Box mb={2} display="flex" alignItems="center" minHeight="50px">
                    {tokenImageUrl && (
                      <Box mr={1} display="flex">
                        <img src={tokenImageUrl} alt={tokenSymbol} width="32px" />
                      </Box>
                    )}
                    <Typography variant="subtitle1" component="div">
                      {claimableAmountDisplay} {tokenSymbol}
                    </Typography>
                  </Box>
                  { withdrawn &&
                    <Box mb={2}>
                      <Typography variant="body2" color="secondary" component="div">
                        Total claimed: { parseFloat(utils.formatEther(withdrawn)).toFixed(2) }
                      </Typography>
                    </Box>
                  }
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
                    <Typography variant="h6" component="div">
                      Pending {tokenSymbol} <InfoTooltip title={'Tokens that will be claimable once merkle root is published on-chain'} />
                    </Typography>
                  </Box>
                  <Box mb={2} display="flex" justifyContent="space-between" minHeight="50px">
                    <Box mb={2} display="flex" alignItems="center">
                      {tokenImageUrl && (
                        <Box mr={1} display="flex">
                          <img src={tokenImageUrl} alt={tokenSymbol} width="32px" />
                        </Box>
                      )}
                      <Typography variant="subtitle1" component="div">
                        {unclaimableAmountDisplay} {tokenSymbol}
                      </Typography>
                    </Box>
                    {showCountdown && (
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Box>
                          <Typography variant="body1" component="div">
                            <Box display="flex" justifyContent="center" alignItems="center">
                              <strong>Countdown</strong> <InfoTooltip title={'Estimated date when pending rewards will become claimable.'} />
                            </Box>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body1" component="div">
                            {countdown}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  { withdrawn &&
                    <Box mb={2} style={{ opacity: 0, userSelect: 'none', pointerEvents: 'none' }}>
                      <Typography variant="body2" color="secondary" component="div">
                        --
                      </Typography>
                    </Box>
                  }
                </Box>
                <Box mb={2}>
                  <Button variant="contained" href={txHistoryLink} fullWidth large target="_blank" rel="noopener noreferrer" disabled={!showCountdown}>Tx History →</Button>
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
