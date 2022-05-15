import React, { useState, useEffect } from 'react'
import Alert from 'src/components/alert/Alert'
import Box from '@material-ui/core/Box'
import { EthAddress, Flex } from 'src/components/ui'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { AirdropPreviewWrapper } from './AirdropPreviewWrapper'
import { StyledButton } from 'src/components/buttons/StyledButton'
import Typography from '@material-ui/core/Typography'
import { useDistribution } from './useDistribution'
import Button from 'src/components/buttons/Button'
import { useTheme } from '@material-ui/core'
import { useApp } from 'src/contexts/AppContext'
import { AddressModal } from './AddressModal'
import { getAddress } from 'ethers/lib/utils'
import InfoTooltip from 'src/components/InfoTooltip'
import { ExternalLink } from 'src/components/Link'

export const respMaxWidths = [350, 624, 824]

export function AirdropPreview() {
  const theme = useTheme()
  const { address } = useWeb3Context()
  const [airdropAddress, setAirdropAddress] = useState<string>(address?.address || '')
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false)
  const userDistribution = useDistribution(airdropAddress)
  const isEligible = userDistribution?.total >= 0.0001
  const isConnected = !!airdropAddress

  useEffect(() => {
    if (address?.address) {
      setAirdropAddress(address?.address)
    }
  }, [address?.address])

  async function checkAnotherAddress() {
    setShowAddressModal(true)
  }

  async function handleAddressChange(_address: string) {
    try {
      setAirdropAddress(getAddress(_address))
    } catch (err) {
      console.error(err)
      setAirdropAddress('')
    }
    setShowAddressModal(false)
  }

  function handleModalClose() {
    setShowAddressModal(false)
  }

  return (
    <>
      <AirdropPreviewWrapper>
        <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography variant="h4" component="div">
              HOP Token Airdrop
            </Typography>
          </Box>

          {userDistribution?.loading ? (
            <Box m={6} justifyContent="center" textAlign="center">
              <Typography variant="body1" component="div">
                Loading...
              </Typography>
            </Box>
          ) : (
          <>
            {!isConnected && (
              <Box maxWidth="500px">
                <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                  <Typography variant="body1" component="div">
                  Please connect your wallet to check if eligible
                  </Typography>
                </Box >
              </Box>
            )}

            {isConnected && (
            <>
              <Box maxWidth="500px">
                {!isEligible ? (
                  <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                    <Typography variant="subtitle2" component="div">
                    Sorry, the connected account is not eligible for the Hop airdrop 😞
                    </Typography>
                  </Box >
                ) : (
                  <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                    <Typography variant="h3">
                      🥳
                    </Typography>
                    <Typography variant="h5">
                      Congrats! You're eligible for the airdrop
                    </Typography>
                    <Box mt={1} display="flex" flexDirection="column">
                      <Typography variant="body1" component="div">
                        Please view your Airdrop preview details below.
                      </Typography>
                    </Box >
                  </Box >
                )}
              </Box>

              <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center" margin="0 auto" p={1} maxWidth="400px" width="100%">
                <Box display="flex" flexDirection="column" justifyContent="center" my={3}>
                  <Box mr={3}>
                    <Typography variant="body1" component="div">
                      Account: <EthAddress value={airdropAddress} full />
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" component="div">
                    Hop Bridge User: <InfoTooltip
            title={'Users who made a minimum of 2 bridge transactions and $1,000 of volume across the Hop bridge.'} />
                  </Typography>
                  <Typography variant="body1" component="div">
                    <strong>{userDistribution.hopUserTokensFormatted} HOP</strong>
                  </Typography>
                </Box>
                <Box ml={1} mb={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" component="div">
                      Base Amount: <InfoTooltip
            title={'Users who met the minimum Hop Bridge User requirements receive a base amount of HOP.'} />
                    </Typography>
                    <Typography variant="body2" component="div">
                      {userDistribution.baseAmountFormatted} HOP
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" component="div">
                      Early Bird Multiplier: <InfoTooltip
            title={'The earliest Hop users will receive a 2x multiplier and the last users before the snapshot will receive a 1x multiplier. The value of the multiplier decreases linearly over time.'} />
                    </Typography>
                    <Typography variant="body2" component="div">
                      {userDistribution.earlyMultiplierFormatted}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" component="div">
                      Volume Multiplier: <InfoTooltip
            title={'Users who sent more than a certain amount through Hop will receive a multiplier.'} />
                    </Typography>
                    <Typography variant="body2" component="div">
                      {userDistribution.volumeMultiplierFormatted}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" component="div">
                    Liquidity Provider: <InfoTooltip
            title={'Anyone who provided liquidity in the Hop AMMs. The amount of HOP received is relative to how long you were an LP in any pool and how large your position was relative to the size of the entire pool.'} />
                  </Typography>
                  <Typography variant="body1" component="div">
                    <strong>{userDistribution.lpTokensFormatted} HOP</strong>
                  </Typography>
                </Box>

                {userDistribution?.authereumAmount > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" component="div">
                      Authereum User: <InfoTooltip
              title={'Eligible tokens for being an Authereum user'} />
                    </Typography>
                    <Typography variant="body1" component="div">
                      <strong>{userDistribution.authereumAmountFormatted} HOP</strong>
                    </Typography>
                  </Box>
                )}

                {userDistribution?.twitterAmount > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" component="div">
                      Twitter User: <InfoTooltip
              title={'Eligible tokens for being a top active Twitter user'} />
                    </Typography>
                    <Typography variant="body1" component="div">
                      <strong>{userDistribution.twitterAmountFormatted} HOP</strong>
                    </Typography>
                  </Box>
                )}

                {userDistribution?.discordAmount > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" component="div">
                      Discord User: <InfoTooltip
              title={'Eligible tokens for being a top active Discord user'} />
                    </Typography>
                    <Typography variant="body1" component="div">
                      <strong>{userDistribution.discordAmountFormatted} HOP</strong>
                    </Typography>
                  </Box>
                )}

                <Box my={2} style={{ borderTop: `1px solid ${theme.palette.secondary.light}`, width: '100%', opacity: 0.5 }}></Box>
                <Box display="flex" justifyContent="space-between" mb={4}>
                  <Typography variant="body1" component="div">
                    <strong>Total:</strong> <InfoTooltip
            title={'The total amount of HOP this address will be able to claim.'} />
                  </Typography>
                  <Typography variant="body1" component="div">
                    <strong>{userDistribution.totalFormatted} HOP</strong>
                  </Typography>
                </Box>

                {userDistribution?.isBot && (
                  <Box display="flex" mb={2}>
                    <Typography variant="body1" color="textSecondary">
                      This address has been identified as a Sybil attacker and is eliminated from the Hop Bridge User airdrop.
                    </Typography>
                  </Box>
                )}

                {(userDistribution?.numTxs !== null && userDistribution?.numTxs < 2) && (
                  <Box display="flex" mb={2}>
                    <Typography variant="body1" color="textSecondary">
                      This address made {userDistribution?.numTxs} transaction(s) by the date of the snapshot on April 1, 2022 at 00:00:00 UTC. The minimum required by that time was 2.
                    </Typography>
                  </Box>
                )}

                {(userDistribution?.addressVolume !== null && userDistribution?.addressVolume < 1000) && (
                  <Box display="flex" mb={2}>
                    <Typography variant="body1" color="textSecondary">
                      This address made {userDistribution?.addressVolumeFormatted} in total transfer volume by the date of the snapshot on April 1, 2022 at 00:00:00 UTC. The minimum required by that time was $1,000.
                    </Typography>
                  </Box>
                )}

                <Box display="flex" mt={2} mb={2}>
                  <Typography variant="body2" component="div" color="textSecondary">
                    <em>The values above may change between now and the date of the token Airdrop. An announcement will be made by the Hop team on the official announcement channels when tokens are ready to be claimed. The account distribution data can be found on <ExternalLink href="https://github.com/hop-protocol/hop-airdrop/blob/master/src/data/finalDistribution.csv">github</ExternalLink>.</em>
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          <Box mt={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
            <Button onClick={checkAnotherAddress}>Check Another Address</Button>
          </Box>
        </>
      )}
      </Box>
      <Box m={2} display="flex" justifyContent="center">
        <Alert severity="error" text={userDistribution?.error} />
      </Box>
      </AirdropPreviewWrapper>
      <Box my={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
        <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center" textAlign="center" my={2} maxWidth="350px">
          <Box>
            <Typography variant="body1" component="div">
              Check if your Discord or Twitter account is eligible for the <strong>Active User</strong> airdrop
            </Typography>
          </Box>
          <Box m={2}>
            <StyledButton href={"/airdrop/social-verify"}>
              Check Social Account
            </StyledButton>
          </Box>
        </Box>
        <Box mt={4} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" textAlign="center" maxWidth="350px">
          <Box>
            <Typography variant="body1" component="div">
              Check if your Authereum account is eligible for the <strong>Authereum User</strong> airdrop
            </Typography>
          </Box>
          <Box m={2}>
            <StyledButton href={"/airdrop/authereum"}>
              Check Authereum Account
            </StyledButton>
          </Box>
        </Box>
      </Box>
      {showAddressModal && (
        <AddressModal onSubmit={handleAddressChange} onClose={handleModalClose} />
      )}
    </>
  )
}
