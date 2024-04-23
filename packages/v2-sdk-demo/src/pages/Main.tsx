import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { SiteWrapper } from '../components/SiteWrapper'
import { CustomPaper } from '../components/CustomPaper'
import { useInterval } from 'react-use'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { HighlightedButton } from '../components/HighlightedButton'
import Typography from '@mui/material/Typography'
import { providers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useQueryParams } from '../hooks/useQueryParams'
import { HopSendTokens } from '../components/hop/HopSendTokens'
import { RailsGatewaySend } from '../components/railsGateway/RailsGatewaySend'
import { RailsGatewayBond } from '../components/railsGateway/RailsGatewayBond'
import { RailsGatewayGetPathInfo } from '../components/railsGateway/RailsGatewayGetPathInfo'
import { RailsGatewayGetPathId } from '../components/railsGateway/RailsGatewayGetPathId'
import { RailsGatewayGetFee } from '../components/railsGateway/RailsGatewayGetFee'
import { RailsGatewayGetTransferId } from '../components/railsGateway/RailsGatewayGetTransferId'
import { RailsGatewayGetLatestClaim } from '../components/railsGateway/RailsGatewayGetLatestClaim'
import { RailsGatewayGetIsCheckpointValid } from '../components/railsGateway/RailsGatewayGetIsCheckpointValid'
import { RailsGatewayConfirmCheckpoint } from '../components/railsGateway/RailsGatewayConfirmCheckpoint'
import { SendMessage } from '../components/messenger/SendMessage'
import { RelayMessage } from '../components/messenger/RelayMessage'
import { ExitBundle } from '../components/messenger/ExitBundle'
import { GetBundleProof } from '../components/messenger/GetBundleProof'
import { GetEvents } from '../components/messenger/GetEvents'
import { GetMessageIdFromTxHash } from '../components/messenger/GetMessageIdFromTxHash'
import { GetMessageCalldata } from '../components/messenger/GetMessageCalldata'
import { GetContractAddresses } from '../components/messenger/GetContractAddresses'
import { SetContractAddresses } from '../components/messenger/SetContractAddresses'
import { GetMessageSentEvent } from '../components/messenger/GetMessageSentEvent'
import { GetMessageFee } from '../components/messenger/GetMessageFee'
import { SetRpcProviders } from '../components/messenger/SetRpcProviders'
import { Hop } from '@hop-protocol/v2-sdk'
import { useStyles } from '../components/useStyles'
import { useWeb3 } from '../hooks/useWeb3'
import { network } from '../config'

export function Main () {
  // const { sdk, connected, safe } = useSafeAppsSDK()
  const { provider, address, requestWallet, disconnectWallet, checkConnectedNetworkIdOrThrow } = useWeb3()
  const styles = useStyles()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [balance, setBalance] = useState('-')
  const [sdk, setSdk] = useState(() => {
    return new Hop({ network })
  })

  useEffect(() => {
    ;(window as any).sdk = sdk
  }, [sdk])

  const updateBalance = async () => {
    try {
      if (!provider) {
        return
      }
      if (!address) {
        return
      }
      const _balance = await provider.getBalance(address)
      setBalance(formatEther(_balance.toString()))
    } catch (err: any) {
      console.error(err.message)
    }
  }

  const updateBalanceCb = useCallback(updateBalance, [updateBalance])

  useEffect(() => {
    if (address) {
      updateBalanceCb().catch(console.error)
    }
  }, [address, updateBalanceCb])

  useInterval(updateBalance, 5 * 1000)

  const signer = provider?.getSigner()
  const showAccountInfo = false

  const components = [
    <HopSendTokens sdk={sdk} requestWallet={requestWallet} checkConnectedNetworkId={checkConnectedNetworkIdOrThrow} />,
    <RailsGatewayGetPathId sdk={sdk} />,
    <RailsGatewayGetPathInfo sdk={sdk} />,
    <RailsGatewayGetFee sdk={sdk} />,
    <RailsGatewayGetTransferId sdk={sdk} />,
    <RailsGatewayGetLatestClaim sdk={sdk} />,
    <RailsGatewayGetIsCheckpointValid sdk={sdk} />,
    <RailsGatewayConfirmCheckpoint sdk={sdk} requestWallet={requestWallet} checkConnectedNetworkId={checkConnectedNetworkIdOrThrow} />,
    <RailsGatewaySend signer={signer} sdk={sdk} requestWallet={requestWallet} checkConnectedNetworkId={checkConnectedNetworkIdOrThrow} />,
    <RailsGatewayBond signer={signer} sdk={sdk} requestWallet={requestWallet} checkConnectedNetworkId={checkConnectedNetworkIdOrThrow} />,
    <SetContractAddresses sdk={sdk} />,
    <GetContractAddresses sdk={sdk} />,
    <SetRpcProviders sdk={sdk} />,
    <SendMessage signer={signer} sdk={sdk} requestWallet={requestWallet} checkConnectedNetworkId={checkConnectedNetworkIdOrThrow} />,
    <GetBundleProof sdk={sdk} />,
    <RelayMessage signer={signer} sdk={sdk} requestWallet={requestWallet} checkConnectedNetworkId={checkConnectedNetworkIdOrThrow} />,
    <ExitBundle signer={signer} sdk={sdk} requestWallet={requestWallet} checkConnectedNetworkId={checkConnectedNetworkIdOrThrow} />,
    <GetMessageIdFromTxHash sdk={sdk} />,
    <GetMessageCalldata sdk={sdk} />,
    <GetMessageSentEvent sdk={sdk} />,
    <GetMessageFee sdk={sdk} />,
    <GetEvents sdk={sdk} />,
  ]

  return (
    <SiteWrapper>
      <Box p={4} m="0 auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box width="100%" mb={4} display="flex" justifyContent="space-between">
          <Box display="flex">
            <Box>
              <Button variant="outlined" href="https://v2-explorer.hop.exchange/" target="_blank" rel="noopener noreferrer">
                View Explorer
              </Button>
            </Box>
            {!address && (
              <Box ml={4}>
                <HighlightedButton onClick={requestWallet} variant="contained">Connect a Wallet</HighlightedButton>
              </Box>
            )}
            {!!address && (
              <Box>
                <Button onClick={disconnectWallet}>disconnect</Button>
              </Box>
            )}
          </Box>
        </Box>
        {showAccountInfo && (
          <Box mb={4} display="flex" flexDirection="column">
            {!!address && (
                <Box mb={2} display="flex">
                  <Typography variant="body2">
                    account address: {address}
                  </Typography>
                </Box>
            )}
            {!!address && (
              <Box mb={2}>
                <Typography variant="body2">
                  account balance: <span>{balance} ETH</span>
                </Typography>
              </Box>
            )}
          </Box>
        )}
        <Box width="100%" mb={6} display="flex" flexDirection="column">
          {components.map((component: any, i: number) => {
            return (
              <Box mb={8} key={i}>
                <Box maxWidth="1400px" m="0 auto">
                  <CustomPaper>
                    <Box p={4}>
                      {component}
                    </Box>
                  </CustomPaper>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </SiteWrapper>
  )
}
