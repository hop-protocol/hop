import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { SiteWrapper } from '../components/SiteWrapper.js'
import { CustomPaper } from '../components/CustomPaper.js'
import { useInterval } from 'react-use'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { HighlightedButton } from '../components/HighlightedButton.js'
import Typography from '@mui/material/Typography'
import { formatEther } from 'ethers/lib/utils'
import { useQueryParams } from '../hooks/useQueryParams.js'
import { useApp } from '../hooks/useApp.js'
import { useStyles } from '../components/useStyles.js'
import { NetworkSelect } from '../components/NetworkSelect.js'
import { useWeb3Context } from '../contexts/Web3Context.js'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// Import Material UI icons
import BridgeIcon from '@mui/icons-material/CommitRounded'
import RailwayIcon from '@mui/icons-material/TrainRounded'
import StakingIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import MessengerIcon from '@mui/icons-material/SendRounded'
import CodeIcon from '@mui/icons-material/CodeRounded'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import InputAdornment from '@mui/material/InputAdornment'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { CustomSelect } from '../components/CustomSelect.js'
import { CustomMenuItem } from '../components/CustomMenuItem.js'

// Lazy load the components
const HopSendTokens = lazy(() => import('../components/hop/HopSendTokens.js'))
const HopApproveSendTokens = lazy(() => import('../components/hop/HopApproveSendTokens.js'))
const HopSwitchChain = lazy(() => import('../components/hop/HopSwitchChain.js'))
const HopGetTokenAddressByTokenSymbol = lazy(() => import('../components/hop/HopGetTokenAddressByTokenSymbol.js'))
const HopGetMaxBonderFee = lazy(() => import('../components/hop/HopGetMaxBonderFee.js'))
const HopGetMessengerAddress = lazy(() => import('../components/hop/HopGetMessengerAddress.js'))
const HopGetRailsGatewayAddress = lazy(() => import('../components/hop/HopGetRailsGatewayAddress.js'))
const RailsGatewaySend = lazy(() => import('../components/railsGateway/RailsGatewaySend.js'))
const RailsGatewayGetNeedsApprovalForSend = lazy(() => import('../components/railsGateway/RailsGatewayGetNeedsApprovalForSend.js'))
const RailsGatewayGetNeedsApprovalForBond = lazy(() => import('../components/railsGateway/RailsGatewayGetNeedsApprovalForBond.js'))
const RailsGatewayApproveSend = lazy(() => import('../components/railsGateway/RailsGatewayApproveSend.js'))
const RailsGatewayApproveBond = lazy(() => import('../components/railsGateway/RailsGatewayApproveBond.js'))
const RailsGatewayGetTotalSent = lazy(() => import('../components/railsGateway/RailsGatewayGetTotalSent.js'))
const RailsGatewayBond = lazy(() => import('../components/railsGateway/RailsGatewayBond.js'))
const RailsGatewayWithdrawBonds = lazy(() => import('../components/railsGateway/RailsGatewayWithdrawBonds.js'))
const RailsGatewayWithdrawClaim = lazy(() => import('../components/railsGateway/RailsGatewayWithdrawClaim.js'))
const RailsGatewayGetWithdrawableBalance = lazy(() => import('../components/railsGateway/RailsGatewayGetWithdrawableBalance.js'))
const RailsGatewayGetPathInfo = lazy(() => import('../components/railsGateway/RailsGatewayGetPathInfo.js'))
const RailsGatewayGetPathId = lazy(() => import('../components/railsGateway/RailsGatewayGetPathId.js'))
const RailsGatewayGetPathIdLive = lazy(() => import('../components/railsGateway/RailsGatewayGetPathIdLive.js'))
const RailsGatewayGetSendFee = lazy(() => import('../components/railsGateway/RailsGatewayGetSendFee.js'))
const RailsGatewayGetUpdateFee = lazy(() => import('../components/railsGateway/RailsGatewayGetUpdateFee.js'))
const RailsGatewayGetPushClaimFee = lazy(() => import('../components/railsGateway/RailsGatewayGetPushClaimFee.js'))
const RailsGatewayPushClaim = lazy(() => import('../components/railsGateway/RailsGatewayPushClaim.js'))
const RailsGatewayGetTransferId = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferId.js'))
const RailsGatewayGetHeadClaim = lazy(() => import('../components/railsGateway/RailsGatewayGetHeadClaim.js'))
const RailsGatewayGetIsClaimValid = lazy(() => import('../components/railsGateway/RailsGatewayGetIsClaimValid.js'))
const RailsGatewayConfirmClaim = lazy(() => import('../components/railsGateway/RailsGatewayConfirmClaim.js'))
const RailsGatewayGetBucketIndex = lazy(() => import('../components/railsGateway/RailsGatewayGetBucketIndex.js'))
const RailsGatewayGetStakingRegistry = lazy(() => import('../components/railsGateway/RailsGatewayGetStakingRegistry.js'))
const RailsGatewayGetTransferDataHash = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferDataHash.js'))
const RailsGatewayGetNextHopsHash = lazy(() => import('../components/railsGateway/RailsGatewayGetNextHopsHash.js'))
const RailsGatewayGetSourcePool = lazy(() => import('../components/railsGateway/RailsGatewayGetSourcePool.js'))
const RailsGatewayGetTransferSentEventFromTxHash = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferSentEventFromTxHash.js'))
const RailsGatewayGetTransferSentEventFromTransferId = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferSentEventFromTransferId.js'))
const RailsGatewayGetTransferBondedEventFromTxHash = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferBondedEventFromTxHash.js'))
const RailsGatewayGetTransferBondedEventFromTransferId = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferBondedEventFromTransferId.js'))
const RailsGatewayGetTransferSentEvents = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferSentEvents.js'))
const RailsGatewayGetTransferBondedEvents = lazy(() => import('../components/railsGateway/RailsGatewayGetTransferBondedEvents.js'))
const RailsGatewayGetInitialReserveByTokenAddress = lazy(() => import('../components/railsGateway/RailsGatewayGetInitialReserveByTokenAddress.js'))
const RailsGatewayGetClaim = lazy(() => import('../components/railsGateway/RailsGatewayGetClaim.js'))
const StakingRegistryApproveStakeHop = lazy(() => import('../components/stakingRegistry/StakingRegistryApproveStakeHop.js'))
const StakingRegistryStakeHop = lazy(() => import('../components/stakingRegistry/StakingRegistryStakeHop.js'))
const StakingRegistryUnstakeHop = lazy(() => import('../components/stakingRegistry/StakingRegistryUnstakeHop.js'))
const StakingRegistryGetStakedBalance = lazy(() => import('../components/stakingRegistry/StakingRegistryGetStakedBalance.js'))
const StakingRegistryGetWithdrawableBalance = lazy(() => import('../components/stakingRegistry/StakingRegistryGetWithdrawableBalance.js'))
const StakingRegistryGetAppealPeriod = lazy(() => import('../components/stakingRegistry/StakingRegistryGetAppealPeriod.js'))
const StakingRegistryGetFullAppeal = lazy(() => import('../components/stakingRegistry/StakingRegistryGetFullAppeal.js'))
const StakingRegistryGetChallengePeriod = lazy(() => import('../components/stakingRegistry/StakingRegistryGetChallengePeriod.js'))
const StakingRegistryGetMinHopStake = lazy(() => import('../components/stakingRegistry/StakingRegistryGetMinHopStake.js'))
const StakingRegistryGetHopTokenAddress = lazy(() => import('../components/stakingRegistry/StakingRegistryGetHopTokenAddress.js'))
const StakingRegistryGetHopBalance = lazy(() => import('../components/stakingRegistry/StakingRegistryGetHopBalance.js'))
const StakingRegistryMintHop = lazy(() => import('../components/stakingRegistry/StakingRegistryMintHop.js'))
const HopCalcAmountOutMin = lazy(() => import('../components/hop/HopCalcAmountOutMin.js'))
const SendMessage = lazy(() => import('../components/messenger/SendMessage.js'))
const RelayMessage = lazy(() => import('../components/messenger/RelayMessage.js'))
const Execute = lazy(() => import('../components/messenger/Execute.js'))
const ExitBundle = lazy(() => import('../components/messenger/ExitBundle.js'))
const GetBundleProof = lazy(() => import('../components/messenger/GetBundleProof.js'))
const GetEvents = lazy(() => import('../components/messenger/GetEvents.js'))
const GetMessageIdFromTxHash = lazy(() => import('../components/messenger/GetMessageIdFromTxHash.js'))
const GetMessageCalldata = lazy(() => import('../components/messenger/GetMessageCalldata.js'))
const GetContractAddresses = lazy(() => import('../components/messenger/GetContractAddresses.js'))
const SetContractAddresses = lazy(() => import('../components/messenger/SetContractAddresses.js'))
const GetMessageSentEventFromMessageId = lazy(() => import('../components/messenger/GetMessageSentEventFromMessageId.js'))
const GetMessageSentEventFromTxHash = lazy(() => import('../components/messenger/GetMessageSentEventFromTxHash.js'))
const GetMessageFee = lazy(() => import('../components/messenger/GetMessageFee.js'))
const SetRpcProviders = lazy(() => import('../components/messenger/SetRpcProviders.js'))

export function Main () {
  const { provider, address, requestWallet, disconnectWallet } = useWeb3Context()
  const styles = useStyles()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [balance, setBalance] = useState('-')
  const { network, sdk, setNetwork } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [explorerNetwork, setExplorerNetwork] = useState('sepolia');

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
    ['Hop - Get Token Address By Token Symbol', <HopGetTokenAddressByTokenSymbol sdk={sdkWithSigner} />],
    ['Hop - Get Max Bonder Fee', <HopGetMaxBonderFee sdk={sdkWithSigner} />],
    ['Hop - Get Messenger Address', <HopGetMessengerAddress sdk={sdkWithSigner} />],
    ['Hop - Get RailsGateway Address', <HopGetRailsGatewayAddress sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Path ID', <RailsGatewayGetPathId sdk={sdk} />],
    ['Rails Gateway - Get Is Path ID Live', <RailsGatewayGetPathIdLive sdk={sdk} />],
    ['Rails Gateway - Get Path Info', <RailsGatewayGetPathInfo sdk={sdk} />],
    ['Rails Gateway - Get Send Fee', <RailsGatewayGetSendFee sdk={sdk} />],
    ['Rails Gateway - Get Update Fee', <RailsGatewayGetUpdateFee sdk={sdk} />],
    ['Rails Gateway - Get Push Claim Fee', <RailsGatewayGetPushClaimFee sdk={sdk} />],
    ['Rails Gateway - Push Claim', <RailsGatewayPushClaim sdk={sdk} signer={signer} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Transfer ID', <RailsGatewayGetTransferId sdk={sdk} />],
    ['Rails Gateway - Get Head Claim', <RailsGatewayGetHeadClaim sdk={sdk} />],
    ['Rails Gateway - Is Claim Valid', <RailsGatewayGetIsClaimValid sdk={sdk} />],
    ['Rails Gateway - Confirm Claim', <RailsGatewayConfirmClaim signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Bucket Index', <RailsGatewayGetBucketIndex sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Staking Registry Address', <RailsGatewayGetStakingRegistry sdk={sdkWithSigner} />],
    ['Rails Gateway - Send', <RailsGatewaySend signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Needs Approval For Send', <RailsGatewayGetNeedsApprovalForSend sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Needs Approval For Bond', <RailsGatewayGetNeedsApprovalForBond sdk={sdkWithSigner} />],
    ['Rails Gateway - Approve Send', <RailsGatewayApproveSend signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Bond', <RailsGatewayBond signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Approve Bond', <RailsGatewayApproveBond signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Withdraw Bonds', <RailsGatewayWithdrawBonds signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Withdraw Claim', <RailsGatewayWithdrawClaim signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Rails Gateway - Get Withdrawable Balance', <RailsGatewayGetWithdrawableBalance sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Total Sent', <RailsGatewayGetTotalSent sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Transfer Data Hash', <RailsGatewayGetTransferDataHash sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Next Hops Hash', <RailsGatewayGetNextHopsHash sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Source Pool', <RailsGatewayGetSourcePool sdk={sdkWithSigner} />],
    ['Rails Gateway - Get Transfer Sent Event From Transaction Hash', <RailsGatewayGetTransferSentEventFromTxHash sdk={sdk} />],
    ['Rails Gateway - Get Transfer Sent Event From Transfer ID', <RailsGatewayGetTransferSentEventFromTransferId sdk={sdk} />],
    ['Rails Gateway - Get Transfer Bonded Event From Transaction Hash', <RailsGatewayGetTransferBondedEventFromTxHash sdk={sdk} />],
    ['Rails Gateway - Get Transfer Bonded Event From Transfer ID', <RailsGatewayGetTransferBondedEventFromTransferId sdk={sdk} />],
    ['Rails Gateway - Get Transfer Sent Events', <RailsGatewayGetTransferSentEvents sdk={sdk} />],
    ['Rails Gateway - Get Transfer Bonded Events', <RailsGatewayGetTransferBondedEvents sdk={sdk} />],
    ['Rails Gateway - Get Initial Reserve By Token Address', <RailsGatewayGetInitialReserveByTokenAddress sdk={sdk} />],
    ['Rails Gateway - Get Claim', <RailsGatewayGetClaim sdk={sdk} />],
    ['Staking Registry - Get Staked Balance', <StakingRegistryGetStakedBalance sdk={sdkWithSigner} />],
    ['Staking Registry - Get Withdrawable Balance', <StakingRegistryGetWithdrawableBalance sdk={sdkWithSigner} />],
    ['Staking Registry - Get Appeal Period', <StakingRegistryGetAppealPeriod sdk={sdkWithSigner} />],
    ['Staking Registry - Get Full Appeal', <StakingRegistryGetFullAppeal sdk={sdkWithSigner} />],
    ['Staking Registry - Get Challenge Period', <StakingRegistryGetChallengePeriod sdk={sdkWithSigner} />],
    ['Staking Registry - Get Min Hop Stake', <StakingRegistryGetMinHopStake sdk={sdkWithSigner} />],
    ['Staking Registry - Get Hop Token Address', <StakingRegistryGetHopTokenAddress sdk={sdkWithSigner} />],
    ['Staking Registry - Get HOP Balance', <StakingRegistryGetHopBalance sdk={sdkWithSigner} />],
    ['Staking Registry - Mint Testnet Hop', <StakingRegistryMintHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Staking Registry - Approve Stake Hop', <StakingRegistryApproveStakeHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Staking Registry - Stake Hop', <StakingRegistryStakeHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
    ['Staking Registry - Unstake Hop', <StakingRegistryUnstakeHop signer={signer} sdk={sdkWithSigner} requestWallet={requestWallet} />],
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

  // Filter components based on search query
  const filteredComponents = components.filter(([title]) => {
    if (!searchQuery) return true;
    return (title as string).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SiteWrapper>
      <Box 
        p={{ xs: 1, sm: 2, md: 4 }}
        m="0 auto" 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center"
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Add stylish title header */}
        <Box 
          width="100%" 
          mb={3}
          sx={(theme) => ({
            textAlign: 'center',
            position: 'relative',
          })}
        >
          <Typography 
            variant="h1" 
            component="h1"
            sx={(theme) => ({
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 1,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main} 70%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              textShadow: theme.palette.mode === 'dark' ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
              transition: theme.transitions.create(['background', 'transform', 'filter'], {
                duration: theme.transitions.duration.standard
              }),
              '&:hover': {
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                transform: 'translateY(-2px)'
              }
            })}
          >
            Hop v2 Playground
          </Typography>
          <Typography 
            variant="h6" 
            component="h2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 400,
              maxWidth: '700px',
              margin: '0 auto',
              opacity: 0.9
            }}
          >
            Explore and test Hop Protocol v2 SDK functionality
          </Typography>
        </Box>

        <Box 
          width="100%" 
          mb={4} 
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2, 3),
            boxShadow: theme.shadows[1],
            border: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems={{ xs: 'center', sm: 'center', md: 'center', lg: 'flex-start' }}
            flexDirection={{ xs: 'column', md: 'row', lg: 'row' }}
            gap={{ xs: 2, sm: 2, md: 2 }}
            width="100%"
          >
            <Box 
              display="flex"
              alignItems="center"
              justifyContent={{ xs: 'center', sm: 'center', md: 'flex-start' }}
              flexWrap="wrap"
              gap={{ xs: 1.5, sm: 2 }}
              width="100%"
              flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
              sx={{
                maxWidth: { md: '65%', lg: '70%' },
                '& > div': {
                  width: { xs: '100%', sm: '100%', md: 'auto' }
                }
              }}
            >
            <Box width={{ xs: '100%', sm: '100%', lg: 'auto' }}>
                <FormControl 
                  variant="outlined" 
                  size="medium"
                  sx={(theme) => ({ 
                    minWidth: '180px',
                    width: { xs: '100%', sm: '100%', md: '200px', lg: 'auto' },
                    maxWidth: { xs: '100%', sm: '300px' },
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '40px', sm: '40px' },
                    },
                  })}
                >
                  <CustomSelect
                    value={explorerNetwork}
                    onChange={(e) => setExplorerNetwork(e.target.value as string)}
                    displayEmpty
                    startAdornment={
                      <Box mr={1} display="flex" alignItems="center" pl={1}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.5 12C15.5 14.21 13.71 16 11.5 16C9.29 16 7.5 14.21 7.5 12C7.5 9.79 9.29 8 11.5 8C13.71 8 15.5 9.79 15.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12Z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </Box>
                    }
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      PaperProps: {
                        sx: (theme) => ({ 
                          mt: 0.5, 
                          boxShadow: theme.palette.mode === 'dark' 
                            ? '0 4px 20px rgba(0, 0, 0, 0.5)' 
                            : '0 4px 20px rgba(0, 0, 0, 0.15)',
                          backgroundColor: theme.palette.background.paper,
                          '& .MuiMenuItem-root': {
                            padding: '10px 16px',
                            minHeight: '42px',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.04)'
                            }
                          },
                        }),
                      },
                    }}
                    renderValue={() => (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          lineHeight: 1.5,
                          paddingLeft: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                View Explorer
                      </Typography>
                    )}
                  >
                    <MenuItem 
                      component="a" 
                      href="https://v2-explorer.hop.exchange/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: theme => theme.palette.text.primary,
                        backgroundColor: theme => theme.palette.background.paper
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Typography variant="body2">Sepolia Explorer</Typography>
                        } 
                      />
                      <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                        <OpenInNewIcon fontSize="small" />
                      </ListItemIcon>
                    </MenuItem>
                    <MenuItem 
                      component="a" 
                      href="https://v2-explorer.hop.exchange/"
                      target="_blank" 
                      rel="noopener noreferrer"
                      disabled
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'text.disabled',
                        backgroundColor: theme => theme.palette.background.paper
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Typography variant="body2">Mainnet Explorer</Typography>
                        } 
                      />
                      <ListItemIcon sx={{ minWidth: 'auto', ml: 1, opacity: 0.5 }}>
                        <OpenInNewIcon fontSize="small" />
                      </ListItemIcon>
                    </MenuItem>
                  </CustomSelect>
                </FormControl>
            </Box>

            <Box 
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{ xs: 1.5, sm: 2 }}
              width={{ xs: '100%', sm: '100%', md: 'auto', lg: 'auto' }}
              sx={{
                flexWrap: { sm: 'wrap', md: 'wrap', lg: 'nowrap' },
                justifyContent: { xs: 'stretch', sm: 'flex-start' },
                '& > a': {
                  width: { xs: '100%', sm: 'auto' },
                  flex: { xs: '1 0 100%', sm: '0 1 auto', md: '0 0 auto', lg: '0 0 auto' },
                  marginRight: { sm: 1.5 },
                  marginBottom: { sm: 1, lg: 0 },
                  minWidth: { sm: '120px' },
                  maxWidth: { sm: '200px' }
                }
              }}
            >
              <Button
                component="a"
                href="https://app.hop.exchange/"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="primary"
                size="medium"
                endIcon={<OpenInNewIcon fontSize="small" />}
                sx={{
                  height: { xs: '40px', sm: '40px' },
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '100%', sm: 'auto' },
                  fontWeight: 500,
                  borderRadius: '0.5rem',
                  '&:hover': {
                    borderColor: theme => `${theme.palette.primary.main}`,
                    backgroundColor: theme => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                Visit App
              </Button>

              <Button
                component="a"
                href="https://docs.hop.exchange/v2"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="secondary"
                size="medium"
                endIcon={<OpenInNewIcon fontSize="small" />}
                sx={{
                  height: { xs: '40px', sm: '40px' },
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '100%', sm: 'auto' },
                  fontWeight: 500,
                  borderRadius: '0.5rem',
                  '&:hover': {
                    borderColor: theme => `${theme.palette.secondary.main}`,
                    backgroundColor: theme => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                Read Docs
              </Button>

              <Button
                component="a"
                href="https://v2-sdk-docs.hop.exchange/"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="secondary"
                size="medium"
                endIcon={<OpenInNewIcon fontSize="small" />}
                sx={{
                  height: { xs: '40px', sm: '40px' },
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '100%', sm: 'auto' },
                  fontWeight: 500,
                  borderRadius: '0.5rem',
                  '&:hover': {
                    borderColor: theme => `${theme.palette.secondary.main}`,
                    backgroundColor: theme => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                API Reference
              </Button>
            </Box>
            </Box>
            
            <Box
              display="flex"
              alignItems="center"
              justifyContent={{ xs: 'center', sm: 'center', md: 'flex-end', lg: 'flex-end' }}
              width={{ xs: '100%', sm: '100%', md: '250px', lg: 'auto' }}
              gap={{ xs: 2, sm: 2, md: 2 }}
              mt={{ xs: 1, sm: 2, md: 0, lg: 0 }}
              flexDirection={{ xs: 'column', sm: 'row' }}
              sx={{
                flexWrap: { sm: 'wrap', md: 'nowrap', lg: 'nowrap' },
              }}
            >
              <Box 
                sx={(theme) => ({ 
                  minWidth: { xs: '100%', sm: '160px' },
                  maxWidth: { xs: '100%', sm: '200px', md: '180px' },
                  width: { xs: '100%', sm: 'auto' },
                  flex: { sm: '0 0 auto' },
                })}
              >
                <NetworkSelect network={network} setNetwork={setNetwork} />
              </Box>

              {!address && (
                <HighlightedButton 
                  onClick={requestWallet} 
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{
                    minWidth: { xs: '100%', sm: '120px', md: '150px' },
                    maxWidth: { xs: '100%', sm: '200px', md: '180px' },
                    width: { xs: '100%', sm: 'auto' },
                    flex: { sm: '0 0 auto' },
                  }}
                >
                  Connect a Wallet
                </HighlightedButton>
              )}
              
              {showAccountInfo && !!address && (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent={{ xs: 'center', sm: 'flex-end' }}
                  mr={{ xs: 0, sm: 3 }}
                  sx={(theme) => ({
                    backgroundColor: theme.palette.background.default,
                    borderRadius: theme.shape.borderRadius,
                    padding: theme.spacing(1, 2),
                    border: `1px solid ${theme.palette.divider}`,
                    maxWidth: { xs: '100%', sm: '360px' },
                  })}
                >
                  <Box display="flex" flexDirection="column" alignItems={{ xs: 'center', sm: 'flex-end' }}>
                    <Typography 
                      variant="body2" 
                      sx={(theme) => ({ 
                        fontSize: '0.85rem',
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '340px'
                      })}
                    >
                      {address}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={(theme) => ({ 
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: theme.palette.primary.main 
                      })}
                    >
                      {balance} ETH
                    </Typography>
                  </Box>
              </Box>
            )}

            {!!address && (
                <Button 
                  onClick={disconnectWallet}
                  variant="text"
                  color="primary"
                  size="medium"
                  sx={{
                    minWidth: { xs: '100px', sm: '120px' },
                    justifyContent: 'flex-end',
                  }}
                >
                  Disconnect
                </Button>
              )}
              </Box>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box 
          width="100%" 
          mb={4}
          sx={(theme) => ({
            backgroundColor: 'transparent',
            borderRadius: theme.shape.borderRadius,
            overflow: 'visible',
          })}
        >
          <Paper
            component="form"
            onSubmit={(e) => e.preventDefault()}
            elevation={0}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              borderRadius: '0.5rem',
              transition: theme.transitions.create(['box-shadow', 'border-color', 'background-color'], {
                duration: theme.transitions.duration.short
              }),
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              position: 'relative',
              overflow: 'visible',
              '&:hover': {
                borderColor: `${theme.palette.primary.main}80`,
                boxShadow: `0 0 0 1px ${theme.palette.primary.main}30`,
              },
              '&:focus-within': {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 1px ${theme.palette.primary.main}30`,
              },
              '&::after': searchQuery ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                transition: 'opacity 0.3s ease',
                opacity: 1,
                borderBottomLeftRadius: '0.5rem',
                borderBottomRightRadius: '0.5rem',
                zIndex: 1,
                transform: 'translateY(-1px)'
              } : {}
            })}
          >
            <InputBase
              sx={(theme) => ({ 
                ml: { xs: 1.5, sm: 2 },
                flex: 1,
                padding: { xs: theme.spacing(1.5, 1), sm: theme.spacing(1.75, 2) },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                  fontWeight: 400,
                  transition: theme.transitions.create(['font-size', 'font-weight']),
                  '&:focus': {
                    fontWeight: 500
                  }
                },
                transition: theme.transitions.create('width'),
              })}
              placeholder="Filter methods, classes or functions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon 
                    sx={{ 
                      fontSize: { xs: '1.2rem', sm: '1.5rem' },
                      color: searchQuery ? 'primary.main' : 'action.active',
                      transition: theme => theme.transitions.create(['color'], {
                        duration: theme.transitions.duration.shorter
                      })
                    }} 
                  />
                </InputAdornment>
              }
              endAdornment={
                searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={() => setSearchQuery('')}
                      edge="end"
                      sx={(theme) => ({
                        transition: theme.transitions.create(['background-color']),
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.08)' 
                            : 'rgba(0, 0, 0, 0.04)',
                          color: theme.palette.primary.main
                        },
                        animation: 'fadeIn 0.3s ease',
                        '@keyframes fadeIn': {
                          '0%': { opacity: 0 },
                          '100%': { opacity: 1 }
                        },
                        zIndex: 2
                      })}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
            {searchQuery && (
              <Box 
                component="div" 
                sx={{ 
                  position: 'absolute', 
                  right: 50, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: filteredComponents.length > 0 ? 'block' : 'none',
                  animation: 'fadeIn 0.3s ease',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                  },
                  zIndex: 2
                }}
              >
                {filteredComponents.length} {filteredComponents.length === 1 ? 'result' : 'results'}
              </Box>
            )}
          </Paper>
              </Box>

        <Box 
          width="100%" 
          mb={6} 
          display="flex" 
          flexDirection="column" 
          sx={{
            width: '100%',
            overflowX: 'hidden',
            '& > *': {
              width: '100%'
            }
          }}
        >
          {filteredComponents.length > 0 ? (
            filteredComponents.map(([title, component], i) => {
            const id = (title as string).replace(/\s+/g, '-')
              // Identify component category for styling
              const category = (title as string).split(' - ')[0].trim()
              const componentType = (title as string).split(' - ')[1]?.trim() || ''
              
              // Define icon and color based on category
              let CategoryIcon = CodeIcon
              let categoryColor = ''
              
              switch(category) {
                case 'Hop':
                  CategoryIcon = BridgeIcon // Bridge icon
                  categoryColor = 'primary.main'
                  break
                case 'Rails Gateway':
                  CategoryIcon = RailwayIcon // Railway icon
                  categoryColor = 'secondary.main'
                  break
                case 'Staking Registry':
                  CategoryIcon = StakingIcon // Wallet/Staking icon
                  categoryColor = 'success.main'
                  break
                case 'Messenger':
                  CategoryIcon = MessengerIcon // Send/Message icon
                  categoryColor = 'info.main'
                  break
                default:
                  CategoryIcon = CodeIcon // Default icon
                  categoryColor = 'text.primary'
              }
              
              // Define function types for additional styling
              const isWrite = /(send|approve|stake|unstake|execute|relay|exit|mint|confirm|withdraw)/i.test(componentType || '') && 
                !/(Get Max Bonder Fee|Get Send Fee|Get Push Claim Fee|Get Needs Approval For Send|Get Needs Approval For Bond|Get Transfer Bonded Event From Transaction Hash|Get Transfer Bonded Event From Transfer ID|Get Transfer Bonded Events)/i.test(title as string)
              const isRead = !isWrite
              
            return (
                <Accordion 
                  key={i} 
                  expanded={expanded[components.findIndex(comp => comp[0] === title)]} 
                  onChange={handleChange(components.findIndex(comp => comp[0] === title))} 
                  id={id}
                  sx={(theme) => ({
                    marginBottom: theme.spacing(1.5),
                    borderRadius: `${theme.shape.borderRadius}px !important`,
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none', // Remove the default divider
                    },
                    boxShadow: expanded[components.findIndex(comp => comp[0] === title)] ? theme.shadows[2] : theme.shadows[1],
                    transition: theme.transitions.create(['box-shadow', 'margin', 'border-left', 'background-color'], {
                      duration: theme.transitions.duration.short
                    }),
                    border: `1px solid ${expanded[components.findIndex(comp => comp[0] === title)] 
                      ? theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main'] 
                      : theme.palette.divider}`,
                    borderLeft: `4px solid ${expanded[components.findIndex(comp => comp[0] === title)] 
                      ? theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main'] 
                      : `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}40`}`,
                    '&.Mui-expanded': {
                      margin: `${theme.spacing(1.5)} 0`,
                    },
                    maxWidth: '100%',
                    width: '100%',
                    backgroundColor: expanded[components.findIndex(comp => comp[0] === title)]
                      ? `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}05`
                      : isWrite 
                        ? `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}03`
                        : `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}02`,
                    '&:hover': {
                      backgroundColor: expanded[components.findIndex(comp => comp[0] === title)]
                        ? `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}08`
                        : `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}06`,
                      borderColor: `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}70`,
                    }
                  })}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon 
                      color={expanded[components.findIndex(comp => comp[0] === title)] ? "primary" : "action"} 
                      sx={{ 
                        transition: 'transform 0.3s ease, color 0.3s ease',
                        transform: expanded[components.findIndex(comp => comp[0] === title)] ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: expanded[components.findIndex(comp => comp[0] === title)] 
                          ? theme => theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main'] 
                          : 'inherit'
                      }}
                    />}
                    aria-controls={`panel${components.findIndex(comp => comp[0] === title)}-content`}
                    id={`panel${components.findIndex(comp => comp[0] === title)}-header`}
                    sx={(theme) => ({
                      padding: { xs: theme.spacing(1.5, 1.5, 1.5, 2), sm: theme.spacing(1.5, 2, 1.5, 3) },
                      backgroundColor: expanded[components.findIndex(comp => comp[0] === title)] 
                        ? `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}10`
                        : 'transparent',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: expanded[components.findIndex(comp => comp[0] === title)]
                          ? `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}15`
                          : `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}05`,
                      },
                      '& .MuiAccordionSummary-content': {
                        margin: theme.spacing(0.5, 0),
                      }
                    })}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      <Box 
                        sx={(theme) => ({ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: { xs: 0.75, sm: 1 },
                          opacity: expanded[components.findIndex(comp => comp[0] === title)] ? 1 : 0.85,
                          transition: 'all 0.2s ease',
                          color: theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main'],
                          backgroundColor: expanded[components.findIndex(comp => comp[0] === title)]
                            ? `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}20`
                            : `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}10`,
                          padding: '8px',
                          borderRadius: '50%',
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                          boxShadow: 'none',
                        })}
                      >
                        <CategoryIcon fontSize="small" />
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" width="100%">
                          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} flexWrap="wrap" sx={{ flex: 1 }}>
                            {/* Category Label */}
                            <Box 
                              px={1}
                              py={0.2}
                              bgcolor={(theme) => `${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}15`}
                              borderRadius="4px"
                              border={(theme) => `1px solid ${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}30`}
                              mr={{ xs: 0, sm: 2 }}
                              mb={{ xs: 0.75, sm: 0 }}
                              mt={{ xs: 0, sm: 0 }}
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                maxHeight: '22px',
                                minWidth: { xs: '50px', sm: '60px' },
                                justifyContent: 'center',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  width: '2px',
                                  height: '100%',
                                  bgcolor: (theme) => theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main'],
                                }
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontSize: '0.75rem',
                                  color: (theme) => theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main'],
                                  fontWeight: 600,
                                  letterSpacing: '0.02em',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {category}
                              </Typography>
                            </Box>
                            
                            <Typography 
                              variant="subtitle1" 
                              fontWeight={expanded[components.findIndex(comp => comp[0] === title)] ? 600 : 500}
                              color="text.primary"
                              sx={(theme) => ({
                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                transition: theme.transitions.create(['font-weight']),
                                letterSpacing: expanded[components.findIndex(comp => comp[0] === title)] ? '0.01em' : 'normal',
                                wordBreak: 'break-word',
                                ml: { xs: 0, sm: componentType ? 1 : 0 },
                                mt: { xs: componentType ? 1 : 0, sm: 0 }
                              })}
                            >
                              {/* Show only the component type part (after the dash) */}
                              {componentType || title}
                            </Typography>
                          </Box>
                          
                          {/* Function type indicator - right aligned */}
                          {componentType && (
                            <Box 
                              display="flex"
                              alignItems="center"
                              mt={{ xs: 0.75, sm: 0 }}
                              alignSelf={{ xs: 'flex-start', sm: 'center' }}
                              ml={{ xs: 0, sm: 2 }}
                              sx={{ 
                                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                                minWidth: { xs: 'auto', sm: '70px' }
                              }}
                            >
                              <Box 
                                sx={{
                                  bgcolor: isWrite ? '#e67e22' : 'info.main',
                                  width: '3px',
                                  height: '16px',
                                  mr: 1,
                                  borderRadius: '1px',
                                }}
                              />
                              <Box
                                px={1}
                                py={0.2}
                                bgcolor={isWrite 
                                  ? (theme) => `rgba(230, 126, 34, 0.15)`
                                  : (theme) => `${theme.palette.info.main}15`
                                }
                                borderRadius="4px"
                                border={(theme) => `1px solid ${
                                  isWrite 
                                    ? `rgba(230, 126, 34, 0.3)`
                                    : `${theme.palette.info.main}30`
                                }`}
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  maxHeight: '22px',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: '2px',
                                    height: '100%',
                                    bgcolor: isWrite ? '#e67e22' : 'info.main',
                                  }
                                }}
                              >
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    color: isWrite ? '#e67e22' : 'info.main',
                                    fontWeight: 600,
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {isWrite ? 'Write' : 'Read'}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                        
                        {expanded[components.findIndex(comp => comp[0] === title)] && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mt: 1,
                              ml: { xs: 0, sm: 0.5 },
                              fontStyle: 'italic',
                              opacity: 0.8,
                              fontSize: { xs: '0.8rem', sm: '0.85rem' }
                            }}
                          >
                            {title}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                </AccordionSummary>

                  <AccordionDetails
                    sx={(theme) => ({
                      padding: theme.spacing(3, 0),
                      backgroundColor: theme.palette.background.paper,
                      overflowX: 'hidden', // Prevent horizontal overflow
                      borderTop: `1px solid ${theme.palette.divider}`
                    })}
                  >
                    {expanded[components.findIndex(comp => comp[0] === title)] && (
                      <Suspense fallback={
                        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                          <Typography color="text.secondary">Loading component...</Typography>
                        </Box>
                      }>
                        <Box mb={4} sx={{ width: '100%', overflowX: 'hidden' }}>
                          <Box 
                            m="0 auto" 
                            sx={(theme) => ({
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '4px',
                                height: '100%',
                                backgroundColor: theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main'],
                                opacity: 0.9,
                                borderTopLeftRadius: theme.shape.borderRadius,
                                borderBottomLeftRadius: theme.shape.borderRadius,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              },
                              maxWidth: '100%',
                              pl: { xs: 1, sm: 2 },
                              pr: { xs: 1, sm: 2 },
                              mx: { xs: 1, sm: 2 }
                            })}
                          >
                            <CustomPaper
                              sx={(theme) => ({
                                border: `1px solid ${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}20`,
                                boxShadow: `0 0 12px ${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}10`,
                                '&:hover': {
                                  boxShadow: `0 0 16px ${theme.palette[categoryColor.split('.')[0]][categoryColor.split('.')[1] || 'main']}15`,
                                }
                              })}
                            >
                              <Box p={{ xs: 2, sm: 4 }}>{component}</Box>
                            </CustomPaper>
                          </Box>
                        </Box>
                      </Suspense>
                    )}
                  </AccordionDetails>
                </Accordion>
            )
            })
          ) : (
            <Box 
              sx={(theme) => ({
                padding: { xs: theme.spacing(4), sm: theme.spacing(8) },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                margin: { xs: theme.spacing(0, 1), sm: 0 }
              })}
            >
              <SearchIcon 
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3rem' }, 
                  color: 'text.disabled',
                  mb: 2
                }} 
              />
              <Typography 
                variant="h6" 
                color="text.secondary"
                align="center"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                No components match your search
              </Typography>
              <Typography 
                variant="body2" 
                color="text.disabled"
                align="center"
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  px: { xs: 2, sm: 0 }
                }}
              >
                Try a different search term or clear the search
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{ 
                  mt: 3,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
                onClick={() => setSearchQuery('')}
                startIcon={<ClearIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              >
                Clear Search
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </SiteWrapper>
  )
}
