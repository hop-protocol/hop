import React, { useState, useEffect, useCallback } from 'react'
import { SiteWrapper } from '../components/SiteWrapper'
import { CustomPaper } from '../components/CustomPaper'
import { useInterval } from 'react-use'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { HighlightedButton } from '../components/HighlightedButton'
import Typography from '@mui/material/Typography'
import { formatEther } from 'ethers/lib/utils'
import { useQueryParams } from '../hooks/useQueryParams'
import { HopSendTokens } from '../components/hop/HopSendTokens'
import { HopApproveSendTokens } from '../components/hop/HopApproveSendTokens'
import { HopSwitchChain } from '../components/hop/HopSwitchChain'
import { RailsGatewaySend } from '../components/railsGateway/RailsGatewaySend'
import { RailsGatewaySendMultiHop } from '../components/railsGateway/RailsGatewaySendMultiHop'
import { RailsGatewayBondAndForward } from '../components/railsGateway/RailsGatewayBondAndForward'
import { RailsGatewayPostMultiHopClaim } from '../components/railsGateway/RailsGatewayPostMultiHopClaim'
import { RailsGatewayApproveSend } from '../components/railsGateway/RailsGatewayApproveSend'
import { RailsGatewayApproveBond } from '../components/railsGateway/RailsGatewayApproveBond'
import { RailsGatewayBond } from '../components/railsGateway/RailsGatewayBond'
import { RailsGatewayGetPathInfo } from '../components/railsGateway/RailsGatewayGetPathInfo'
import { RailsGatewayGetPathId } from '../components/railsGateway/RailsGatewayGetPathId'
import { RailsGatewayGetFee } from '../components/railsGateway/RailsGatewayGetFee'
import { RailsGatewayGetTransferId } from '../components/railsGateway/RailsGatewayGetTransferId'
import { RailsGatewayGetLatestClaim } from '../components/railsGateway/RailsGatewayGetLatestClaim'
import { RailsGatewayGetIsCheckpointValid } from '../components/railsGateway/RailsGatewayGetIsCheckpointValid'
import { RailsGatewayConfirmCheckpoint } from '../components/railsGateway/RailsGatewayConfirmCheckpoint'
import { RailsGatewayGetTransferSentEventFromTxHash } from '../components/railsGateway/RailsGatewayGetTransferSentEventFromTxHash'
// import { RailsGatewayGetTransferSentEventFromTransferId } from '../components/railsGateway/RailsGatewayGetTransferSentEventFromTransferId'
import { RailsGatewayGetTransferSentEventFromCheckpoint } from '../components/railsGateway/RailsGatewayGetTransferSentEventFromCheckpoint'
import { RailsGatewayGetTransferBondedEventFromTxHash } from '../components/railsGateway/RailsGatewayGetTransferBondedEventFromTxHash'
import { RailsGatewayGetTransferBondedEventFromCheckpoint } from '../components/railsGateway/RailsGatewayGetTransferBondedEventFromCheckpoint'
import { RailsGatewayGetTransferSentEvents } from '../components/railsGateway/RailsGatewayGetTransferSentEvents'
import { RailsGatewayGetTransferBondedEvents } from '../components/railsGateway/RailsGatewayGetTransferBondedEvents'
import { RailsGatewayCalcAmountOutMin } from '../components/railsGateway/RailsGatewayCalcAmountOutMin'
import { SendMessage } from '../components/messenger/SendMessage'
import { RelayMessage } from '../components/messenger/RelayMessage'
import { Execute } from '../components/messenger/Execute'
import { ExitBundle } from '../components/messenger/ExitBundle'
import { GetBundleProof } from '../components/messenger/GetBundleProof'
import { GetEvents } from '../components/messenger/GetEvents'
import { GetMessageIdFromTxHash } from '../components/messenger/GetMessageIdFromTxHash'
import { GetMessageCalldata } from '../components/messenger/GetMessageCalldata'
import { GetContractAddresses } from '../components/messenger/GetContractAddresses'
import { SetContractAddresses } from '../components/messenger/SetContractAddresses'
import { GetMessageSentEventFromMessageId } from '../components/messenger/GetMessageSentEventFromMessageId'
import { GetMessageSentEventFromTxHash } from '../components/messenger/GetMessageSentEventFromTxHash'
import { GetMessageFee } from '../components/messenger/GetMessageFee'
import { SetRpcProviders } from '../components/messenger/SetRpcProviders'
import { Hop } from '@hop-protocol/v2-sdk'
import { useStyles } from '../components/useStyles'
import { useWeb3Context } from '../contexts/Web3Context'
import { network } from '../config'

export function Main () {
  // const { sdk, connected, safe } = useSafeAppsSDK()
  const { provider, address, requestWallet, disconnectWallet } = useWeb3Context()
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

  const sdkWithSigner = signer ? sdk.connect(signer) : sdk

  const components = [
    <HopSendTokens signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <HopApproveSendTokens signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <HopSwitchChain signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewayGetPathId sdk={sdk} />,
    <RailsGatewayGetPathInfo sdk={sdk} />,
    <RailsGatewayGetFee sdk={sdk} />,
    <RailsGatewayGetTransferId sdk={sdk} />,
    <RailsGatewayGetLatestClaim sdk={sdk} />,
    <RailsGatewayGetIsCheckpointValid sdk={sdk} />,
    <RailsGatewayConfirmCheckpoint signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewaySend signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewaySendMultiHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewayBondAndForward signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewayPostMultiHopClaim signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewayApproveSend signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewayBond signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewayApproveBond signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RailsGatewayGetTransferSentEventFromTxHash sdk={sdk} />,
    <RailsGatewayGetTransferSentEventFromCheckpoint sdk={sdk} />,
    <RailsGatewayGetTransferBondedEventFromTxHash sdk={sdk} />,
    <RailsGatewayGetTransferBondedEventFromCheckpoint sdk={sdk} />,
    <RailsGatewayGetTransferSentEvents sdk={sdk} />,
    <RailsGatewayGetTransferBondedEvents sdk={sdk} />,
    <RailsGatewayCalcAmountOutMin sdk={sdk} />,
    <SetContractAddresses sdk={sdk} />,
    <GetContractAddresses sdk={sdk} />,
    <SetRpcProviders sdk={sdk} />,
    <SendMessage signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <GetBundleProof sdk={sdk} />,
    <Execute signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <RelayMessage signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <ExitBundle signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />,
    <GetMessageIdFromTxHash sdk={sdk} />,
    <GetMessageCalldata sdk={sdk} />,
    <GetMessageSentEventFromMessageId sdk={sdk} />,
    <GetMessageSentEventFromTxHash sdk={sdk} />,
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
