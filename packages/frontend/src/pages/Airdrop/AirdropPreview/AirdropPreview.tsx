import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import { EthAddress, Flex } from 'src/components/ui'
import { useAirdropPreview } from './useAirdropPreview'
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

export const respMaxWidths = [350, 624, 824]

export function AirdropPreview() {
  const theme = useTheme()
  const { address } = useWeb3Context()
  const [airdropAddress, setAirdropAddress] = useState<string>(address?.address || '')
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false)
  // const { eligibility } = useAirdropPreview(address)
  const userDistribution = useDistribution(airdropAddress)
  const isEligible = userDistribution?.lpTokens || userDistribution?.hopUserTokens
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
              Hop Token Airdrop
            </Typography>
          </Box >

          {!isConnected && (
            <Box px={4} maxWidth="500px">
              <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                <Typography variant="subtitle2" component="div" color="textSecondary">
                Please connect your wallet to check if eligible
                </Typography>
              </Box >
            </Box>
          )}

          {isConnected && (
          <>
            <Box px={4} maxWidth="500px">
              {!isEligible ? (
                <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                  <Typography variant="subtitle2" component="div" color="textSecondary">
                  Sorry, the connected account is not eligible for the Hop airdrop 😞
                  </Typography>
                </Box >
              ) : (
                <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                  <Typography variant="subtitle1" component="div">
                    You are eligible for the Hop airdrop! 🎉
                  </Typography>
                  <Typography variant="body1" component="div">
                    Please view your Airdrop preview details below.
                  </Typography>
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
                  Hop Bridge User:
                </Typography>
                <Typography variant="body1" component="div">
                  {userDistribution.hopUserTokens} HOP
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" component="div">
                  Liquidity Provider:
                </Typography>
                <Typography variant="body1" component="div">
                  {userDistribution.lpTokens} HOP
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" component="div">
                  Early Bird Multiplier:
                </Typography>
                <Typography variant="body1" component="div">
                  {userDistribution.earlyMultiplier} HOP
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" component="div">
                  Volume Multiplier:
                </Typography>
                <Typography variant="body1" component="div">
                  {userDistribution.volumeMultiplier} HOP
                </Typography>
              </Box>
              <Box my={2} style={{ borderTop: `1px solid ${theme.palette.secondary.light}`, width: '100%', opacity: 0.5 }}></Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" component="div">
                  <strong>Total:</strong>
                </Typography>
                <Typography variant="body1" component="div">
                  <strong>{userDistribution.total} HOP</strong>
                </Typography>
              </Box>

              <Box display="flex" mt={5}>
                <Typography variant="body1" component="div">
                  <em>An announcement will be made by the Hop team on the official announcement channels when tokens are ready to be claimed.</em>
                </Typography>
              </Box>
            </Box>
          </>
        )}
        </Box>

      <Box mt={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
        <Button onClick={checkAnotherAddress}>Check another address</Button>
      </Box>

      </AirdropPreviewWrapper>
      <Box my={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
        <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center" my={2}>
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
        <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center">
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
