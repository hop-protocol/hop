import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { SiteWrapper } from '../components/SiteWrapper'
import { CustomPaper } from '../components/CustomPaper'
import { useInterval } from 'react-use'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { HighlightedButton } from '../components/HighlightedButton'
import Typography from '@mui/material/Typography'
import { formatEther } from 'ethers/lib/utils'
import { useQueryParams } from '../hooks/useQueryParams'
import { Hop } from '@hop-protocol/v2-sdk'
import { useStyles } from '../components/useStyles'
import { useWeb3Context } from '../contexts/Web3Context'
import { network } from '../config'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// Lazy load the components
const HopSendTokens = lazy(() => import('../components/hop/HopSendTokens'))
const HopApproveSendTokens = lazy(() => import('../components/hop/HopApproveSendTokens'))
const HopSwitchChain = lazy(() => import('../components/hop/HopSwitchChain'))
const RailsGatewaySend = lazy(() => import('../components/railsGateway/RailsGatewaySend'))
const RailsGatewayGetNeedsApprovalForSend = lazy(() => import('../components/railsGateway/RailsGatewayGetNeedsApprovalForSend'))
const RailsGatewayGetNeedsApprovalForBond = lazy(() => import('../components/railsGateway/RailsGatewayGetNeedsApprovalForBond'))
const RailsGatewayApproveSend = lazy(() => import('../components/railsGateway/RailsGatewayApproveSend'))
const RailsGatewayApproveBond = lazy(() => import('../components/railsGateway/RailsGatewayApproveBond'))
const RailsGatewayGetTotalSent = lazy(() => import('../components/railsGateway/RailsGatewayGetTotalSent'))
const RailsGatewayBond = lazy(() => import('../components/railsGateway/RailsGatewayBond'))
const RailsGatewayWithdraw = lazy(() => import('../components/railsGateway/RailsGatewayWithdraw'))
const RailsGatewayGetWithdrawableBalance = lazy(() => import('../components/railsGateway/RailsGatewayGetWithdrawableBalance'))
const RailsGatewayGetPathInfo = lazy(() => import('../components/railsGateway/RailsGatewayGetPathInfo'))
const RailsGatewayGetPathId = lazy(() => import('../components/railsGateway/RailsGatewayGetPathId'))
const RailsGatewayGetPathIdLive = lazy(() => import('../components/railsGateway/RailsGatewayGetPathIdLive'))
const RailsGatewayGetSendFee = lazy(() => import('../components/railsGateway/RailsGatewayGetSendFee'))
const RailsGatewayGetUpdateFee = lazy(() => import('../components/railsGateway/RailsGatewayGetUpdateFee'))
const RailsGatewayGetTransferId = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferId'))
const RailsGatewayGetHeadClaim = lazy(() => import('../components/railsGateway/RailsGatewayGetHeadClaim'))
const RailsGatewayGetIsClaimValid = lazy(() => import('../components/railsGateway/RailsGatewayGetIsClaimValid'))
const RailsGatewayPostClaim = lazy(() => import('../components/railsGateway/RailsGatewayPostClaim'))
const RailsGatewayConfirmClaim = lazy(() => import('../components/railsGateway/RailsGatewayConfirmClaim'))
const RailsGatewayGetBucketIndex = lazy(() => import('../components/railsGateway/RailsGatewayGetBucketIndex'))
const RailsGatewayGetStakingRegistry = lazy(() => import('../components/railsGateway/RailsGatewayGetStakingRegistry'))
const RailsGatewayGetTransferDataHash = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferDataHash'))
const RailsGatewayBatchUpdateClaimChain = lazy(() => import('../components/railsGateway/RailsGatewayBatchUpdateClaimChain'))
const RailsGatewayUpdateClaimChain = lazy(() => import('../components/railsGateway/RailsGatewayUpdateClaimChain'))
const RailsGatewayGetTransferSentEventFromTxHash = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferSentEventFromTxHash'))
const RailsGatewayGetTransferSentEventFromTransferId = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferSentEventFromTransferId'))
const RailsGatewayGetTransferBondedEventFromTxHash = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferBondedEventFromTxHash'))
const RailsGatewayGetTransferBondedEventFromTransferId = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferBondedEventFromTransferId'))
const RailsGatewayGetTransferSentEvents = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferSentEvents'))
const RailsGatewayGetTransferBondedEvents = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferBondedEvents'))
const StakingRegistryApproveStakeHop = lazy(() => import('../components/stakingRegistry/StakingRegistryApproveStakeHop'))
const StakingRegistryStakeHop = lazy(() => import('../components/stakingRegistry/StakingRegistryStakeHop'))
const StakingRegistryUnstakeHop = lazy(() => import('../components/stakingRegistry/StakingRegistryUnstakeHop'))
const StakingRegistryGetStakedBalance = lazy(() => import('../components/stakingRegistry/StakingRegistryGetStakedBalance'))
const StakingRegistryGetWithdrawableBalance = lazy(() => import('../components/stakingRegistry/StakingRegistryGetWithdrawableBalance'))
const StakingRegistryGetAppealPeriod = lazy(() => import('../components/stakingRegistry/StakingRegistryGetAppealPeriod'))
const StakingRegistryGetFullAppeal = lazy(() => import('../components/stakingRegistry/StakingRegistryGetFullAppeal'))
const StakingRegistryGetChallengePeriod = lazy(() => import('../components/stakingRegistry/StakingRegistryGetChallengePeriod'))
const StakingRegistryGetMinHopStake = lazy(() => import('../components/stakingRegistry/StakingRegistryGetMinHopStake'))
const StakingRegistryGetHopTokenAddress = lazy(() => import('../components/stakingRegistry/StakingRegistryGetHopTokenAddress'))
const StakingRegistryMintHop = lazy(() => import('../components/stakingRegistry/StakingRegistryMintHop'))
const HopCalcAmountOutMin = lazy(() => import('../components/hop/HopCalcAmountOutMin'))
const SendMessage = lazy(() => import('../components/messenger/SendMessage'))
const RelayMessage = lazy(() => import('../components/messenger/RelayMessage'))
const Execute = lazy(() => import('../components/messenger/Execute'))
const ExitBundle = lazy(() => import('../components/messenger/ExitBundle'))
const GetBundleProof = lazy(() => import('../components/messenger/GetBundleProof'))
const GetEvents = lazy(() => import('../components/messenger/GetEvents'))
const GetMessageIdFromTxHash = lazy(() => import('../components/messenger/GetMessageIdFromTxHash'))
const GetMessageCalldata = lazy(() => import('../components/messenger/GetMessageCalldata'))
const GetContractAddresses = lazy(() => import('../components/messenger/GetContractAddresses'))
const SetContractAddresses = lazy(() => import('../components/messenger/SetContractAddresses'))
const GetMessageSentEventFromMessageId = lazy(() => import('../components/messenger/GetMessageSentEventFromMessageId'))
const GetMessageSentEventFromTxHash = lazy(() => import('../components/messenger/GetMessageSentEventFromTxHash'))
const GetMessageFee = lazy(() => import('../components/messenger/GetMessageFee'))
const SetRpcProviders = lazy(() => import('../components/messenger/SetRpcProviders'))

export function Main () {
  const { provider, address, requestWallet, disconnectWallet } = useWeb3Context()
  const styles = useStyles()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [balance, setBalance] = useState('-')
  const [sdk, setSdk] = useState(() => {
    return new Hop({
      network,
      signersOrProviders: Hop.getDefaultProviders(network)
    })
  })

  useEffect(() => {
    (window as any).sdk = sdk
  }, [sdk])

  const updateBalance = async () => {
    try {
      if (!provider || !address) {
        return
      }
      const _balance = await provider.getBalance(address)
      setBalance(formatEther(_balance.toString()))
    } catch (err) {
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

  const sdkWithSigner = sdk // TODO

  const components = [
    ['Hop - Send Tokens', <HopSendTokens signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Hop - Approve Send Tokens', <HopApproveSendTokens signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Hop - Switch Chain', <HopSwitchChain signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Hop - Calculate Amount Out Min', <HopCalcAmountOutMin sdk={sdk} />],
    ['Rails Gateway - Get Path ID', <RailsGatewayGetPathId sdk={sdk} />],
    ['Rails Gateway - Get Is Path ID Live', <RailsGatewayGetPathIdLive sdk={sdk} />],
    ['Rails Gateway - Get Path Info', <RailsGatewayGetPathInfo sdk={sdk} />],
    ['Rails Gateway - Get Send Fee', <RailsGatewayGetSendFee sdk={sdk} />],
    ['Rails Gateway - Get Update Fee', <RailsGatewayGetUpdateFee sdk={sdk} />],
    ['Rails Gateway - Get Transfer ID', <RailsGatewayGetTransferId sdk={sdk} />],
    ['Rails Gateway - Get Head Claim', <RailsGatewayGetHeadClaim sdk={sdk} />],
    ['Rails Gateway - Is Claim Valid', <RailsGatewayGetIsClaimValid sdk={sdk} />],
    ['Rails Gateway - Post Claim', <RailsGatewayPostClaim signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Confirm Claim', <RailsGatewayConfirmClaim signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Bucket Index', <RailsGatewayGetBucketIndex sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Staking Registry', <RailsGatewayGetStakingRegistry sdk={sdkWithSigner} />],
    ['Rails Gateway - Send', <RailsGatewaySend signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Needs Approval For Send', <RailsGatewayGetNeedsApprovalForSend sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Needs Approval For Bond', <RailsGatewayGetNeedsApprovalForBond sdk={sdkWithSigner} />],
    ['Rails Gateway - Approve Send', <RailsGatewayApproveSend signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Bond', <RailsGatewayBond signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Approve Bond', <RailsGatewayApproveBond signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Withdraw', <RailsGatewayWithdraw signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Withdrawable Balance', <RailsGatewayGetWithdrawableBalance sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Withdrawable Balance', <RailsGatewayGetWithdrawableBalance sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Total Sent', <RailsGatewayGetTotalSent sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Transfer Data Hash', <RailsGatewayGetTransferDataHash sdk={sdkWithSigner} />],
    ['Rails Gateway - Update Claim Chain', <RailsGatewayUpdateClaimChain signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Batch Update Claim Chain', <RailsGatewayBatchUpdateClaimChain signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Transfer Sent Event From Transaction Hash', <RailsGatewayGetTransferSentEventFromTxHash sdk={sdk} />],
    ['Rails Gateway - Get Transfer Sent Event From Transfer ID', <RailsGatewayGetTransferSentEventFromTransferId sdk={sdk} />],
    ['Rails Gateway - Get Transfer Bonded Event From Transaction Hash', <RailsGatewayGetTransferBondedEventFromTxHash sdk={sdk} />],
    ['Rails Gateway - Get Transfer Bonded Event From Transfer ID', <RailsGatewayGetTransferBondedEventFromTransferId sdk={sdk} />],
    ['Rails Gateway - Get Transfer Sent Events', <RailsGatewayGetTransferSentEvents sdk={sdk} />],
    ['Rails Gateway - Get Transfer Bonded Events', <RailsGatewayGetTransferBondedEvents sdk={sdk} />],
    ['Staking Registry - Mint Testnet Hop', <StakingRegistryMintHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Staking Registry - Approve Stake Hop', <StakingRegistryApproveStakeHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Staking Registry - Stake Hop', <StakingRegistryStakeHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Staking Registry - Unstake Hop', <StakingRegistryUnstakeHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Staking Registry - Get Staked Balance', <StakingRegistryGetStakedBalance sdk={sdkWithSigner} />],
    ['Staking Registry - Get Withdrawable Balance', <StakingRegistryGetWithdrawableBalance sdk={sdkWithSigner} />],
    ['Staking Registry - Get Appeal Period', <StakingRegistryGetAppealPeriod sdk={sdkWithSigner} />],
    ['Staking Registry - Get Full Appeal', <StakingRegistryGetFullAppeal sdk={sdkWithSigner} />],
    ['Staking Registry - Get Challenge Period', <StakingRegistryGetChallengePeriod sdk={sdkWithSigner} />],
    ['Staking Registry - Get Min Hop Stake', <StakingRegistryGetMinHopStake sdk={sdkWithSigner} />],
    ['Staking Registry - Get Hop Token Address', <StakingRegistryGetHopTokenAddress sdk={sdkWithSigner} />],
    ['Messenger - Set Contract Addresses', <SetContractAddresses sdk={sdk} />],
    ['Messenger - Get Contract Addresses', <GetContractAddresses sdk={sdk} />],
    ['Messenger - Set RPC Providers', <SetRpcProviders sdk={sdk} />],
    ['Messenger - Send Message', <SendMessage signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Messenger - Get Bundle Proof From Message ID', <GetBundleProof sdk={sdk} />],
    ['Messenger - Execute', <Execute signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Messenger - Relay Message', <RelayMessage signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Messenger - Exit Bundle', <ExitBundle signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Messenger - Get Message ID From Transaction Hash', <GetMessageIdFromTxHash sdk={sdk} />],
    ['Messenger - Get Message Calldata From Message ID', <GetMessageCalldata sdk={sdk} />],
    ['Messenger - Get Message Sent Event From Message ID', <GetMessageSentEventFromMessageId sdk={sdk} />],
    ['Messenger - Get Message Sent Event From Transaction Hash', <GetMessageSentEventFromTxHash sdk={sdk} />],
    ['Messenger - Get Message Fee', <GetMessageFee sdk={sdk} />],
    ['Messenger - Get Events', <GetEvents sdk={sdk} />],
  ]

  const [expanded, setExpanded] = useState(() => {
    const hash = window.location.hash.substring(1)
    const initialExpanded = components.map(() => false)
    if (hash) {
      const index = components.findIndex(([title]) => (title as string).replace(/\s+/g, '-') === hash)
      if (index !== -1) {
        initialExpanded[index] = true
      }
    } else {
      initialExpanded[0] = true
    }
    return initialExpanded
  })

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash) {
      const element = document.getElementById(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  const handleChange = (panel: number) => (event: any, isExpanded: boolean) => {
    setExpanded(prev => {
      const newExpanded = [...prev]
      newExpanded[panel] = isExpanded
      if (isExpanded) {
        window.location.hash = (components[panel][0] as string).replace(/\s+/g, '-')
      } else {
        window.location.hash = ''
      }
      return newExpanded
    })
  }

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
                <Typography variant="body2">account address: {address}</Typography>
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
        <Box width="100%" mb={6} display="flex" flexDirection="column" minWidth="1400px">
          {components.map(([title, component], i) => {
            const id = (title as string).replace(/\s+/g, '-')
            return (
              <Accordion key={i} expanded={expanded[i]} onChange={handleChange(i)} id={id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${i}-content`}
                  id={`panel${i}-header`}
                >
                  <Typography>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {expanded[i] && (
                    <Suspense fallback={<div>Loading...</div>}>
                      <Box mb={8}>
                        <Box maxWidth="1400px" m="0 auto">
                          <CustomPaper>
                            <Box p={4}>{component}</Box>
                          </CustomPaper>
                        </Box>
                      </Box>
                    </Suspense>
                  )}
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>
      </Box>
    </SiteWrapper>
  )
}
