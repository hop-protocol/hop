import React, { FC, useEffect, useMemo, useState } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Token, CanonicalToken, WrappedToken, ChainId, ChainSlug } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import StakeWidget from 'src/pages/Stake/StakeWidget'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { useSelectedNetwork } from 'src/hooks'
import { isMainnet } from 'src/config'
import { Div, Flex } from 'src/components/ui'
import { findMatchingBridge, findNetworkBySlug, getNetworkProviderOrDefault } from 'src/utils'
import { StakingRewards__factory } from '@hop-protocol/core/contracts'
import { providers, Signer } from 'ethers'
import Network from 'src/models/Network'
import { RaisedNetworkSelector } from 'src/components/NetworkSelector/RaisedNetworkSelector'

const stakingRewardsContracts = {
  polygon: {
    ETH: '0x7bCeDA1Db99D64F25eFA279BB11CE48E15Fda427',
    MATIC: '0x7dEEbCaD1416110022F444B03aEb1D20eB4Ea53f',
    USDC: '0x2C2Ab81Cf235e86374468b387e241DF22459A265',
    USDT: '0x07932e9A5AB8800922B2688FB1FA0DAAd8341772',
  },
  gnosis: {
    DAI: '0x12a3a66720dD925fa93f7C895bC20Ca9560AdFe7',
    ETH: '0xC61bA16e864eFbd06a9fe30Aab39D18B8F63710a',
    USDC: '0x5D13179c5fa40b87D53Ff67ca26245D3D5B2F872',
  },
}

const rewardTokenAddresses = {
  WMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  GNO: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
}

const Stake: FC = () => {
  const { bridges, sdk, networks, user, tokens } = useApp()
  const { provider } = useWeb3Context()

  const availableNetworks = networks.filter(n =>
    [ChainSlug.Gnosis, ChainSlug.Polygon].includes(n.slug as ChainSlug)
  )
  const polygonNetwork = useMemo(() => findNetworkBySlug(ChainSlug.Polygon) as Network, [networks])
  const gnosisNetwork = useMemo(() => findNetworkBySlug(ChainSlug.Gnosis) as Network, [networks])
  const { selectedNetwork, selectBothNetworks } = useSelectedNetwork({
    l2Only: true,
    availableNetworks,
  })
  const [selectedProvider, setSelectedProvider] = useState<providers.Provider | Signer>()

  useEffect(() => {
    sdk.getSignerOrProvider(selectedNetwork.slug).then(setSelectedProvider)
  }, [sdk, selectedNetwork])

  // ETH
  const ethBridge = useAsyncMemo(async () => findMatchingBridge(bridges, 'ETH'), [bridges])
  const ethStakingToken = useAsyncMemo(async () => {
    return ethBridge?.getSaddleLpToken(selectedNetwork.slug)
  }, [ethBridge, selectedNetwork])
  const ethStakingRewards = useAsyncMemo(async () => {
    const _provider = await sdk.getSignerOrProvider(selectedNetwork.slug)
    return StakingRewards__factory.connect(
      stakingRewardsContracts[selectedNetwork.slug].ETH,
      _provider
    )
  }, [sdk, selectedNetwork.slug])

  // MATIC
  const maticBridge = useAsyncMemo(async () => findMatchingBridge(bridges, 'MATIC'), [bridges])
  const maticStakingToken = useAsyncMemo(async () => {
    return maticBridge?.getSaddleLpToken(ChainSlug.Polygon)
  }, [maticBridge])
  const maticStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider(ChainSlug.Polygon)
    const _provider = getNetworkProviderOrDefault(ChainId.Polygon, polygonProvider, provider)
    return StakingRewards__factory.connect(stakingRewardsContracts.polygon.MATIC, _provider)
  }, [sdk, provider, user])

  // USDT
  const usdtBridge = useAsyncMemo(async () => findMatchingBridge(bridges, 'USDT'), [bridges])
  const usdtStakingToken = useAsyncMemo(async () => {
    return usdtBridge?.getSaddleLpToken(ChainSlug.Polygon)
  }, [usdtBridge])
  const usdtStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider(ChainSlug.Polygon)
    const _provider = getNetworkProviderOrDefault(ChainId.Polygon, polygonProvider, provider)
    return StakingRewards__factory.connect(stakingRewardsContracts.polygon.USDT, _provider)
  }, [sdk, provider, user])

  // GNO
  const daiBridge = useAsyncMemo(async () => findMatchingBridge(bridges, 'DAI'), [bridges])
  const daiStakingToken = useAsyncMemo(async () => {
    return daiBridge?.getSaddleLpToken(ChainSlug.Gnosis)
  }, [daiBridge])
  const gnosisStakingRewards = useAsyncMemo(async () => {
    const gnosisProvider = await sdk.getSignerOrProvider(ChainSlug.Gnosis)
    const _provider = getNetworkProviderOrDefault(ChainId.Gnosis, gnosisProvider, provider)
    return StakingRewards__factory.connect(stakingRewardsContracts.gnosis.DAI, _provider)
  }, [sdk, provider, user])

  // USDC
  const usdcBridge = useAsyncMemo(async () => findMatchingBridge(bridges, 'USDC'), [bridges])
  const usdcStakingToken = useAsyncMemo(async () => {
    return usdcBridge?.getSaddleLpToken(selectedNetwork.slug)
  }, [usdcBridge, selectedNetwork])
  const usdcStakingRewards = useAsyncMemo(async () => {
    const _provider = await sdk.getSignerOrProvider(selectedNetwork.slug)
    return StakingRewards__factory.connect(
      stakingRewardsContracts[selectedNetwork.slug].USDC,
      _provider
    )
  }, [sdk, selectedNetwork.slug])

  const rewardsToken = useAsyncMemo(async () => {
    if (!(selectedNetwork && selectedProvider)) {
      return
    }

    if (selectedNetwork.slug === ChainSlug.Polygon) {
      return new Token(
        'mainnet',
        ChainSlug.Polygon,
        rewardTokenAddresses.WMATIC,
        18,
        WrappedToken.WMATIC,
        'Wrapped Matic',
        '',
        selectedProvider
      )
    }

    if (selectedNetwork.slug === ChainSlug.Gnosis) {
      return new Token(
        'mainnet',
        ChainSlug.Gnosis,
        rewardTokenAddresses.GNO,
        18,
        'GNO',
        'Gnosis',
        '',
        selectedProvider
      )
    }
  }, [sdk, selectedNetwork, selectedProvider])

  if (!isMainnet) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4">Staking not available on testnet</Typography>
      </Box>
    )
  }

  const enabledTokens = tokens.map(token => token.symbol)

  return (
    <Flex column alignCenter>
      <Typography variant="h4">Stake</Typography>
      <Div py={28}>
        <Flex justifyCenter mb={4} fullWidth>
          <RaisedNetworkSelector
            selectedNetwork={selectedNetwork}
            onSelect={selectBothNetworks}
            availableNetworks={availableNetworks}
          />
        </Flex>

        {enabledTokens.includes(CanonicalToken.ETH) && (
          <StakeWidget
            network={selectedNetwork}
            bridge={ethBridge}
            stakingToken={ethStakingToken}
            rewardsToken={rewardsToken}
            stakingRewards={ethStakingRewards}
            key={ethStakingToken?.symbol}
          />
        )}
        {selectedNetwork.slug === ChainSlug.Polygon &&
          enabledTokens.includes(CanonicalToken.MATIC) && (
            <StakeWidget
              network={polygonNetwork}
              bridge={maticBridge}
              stakingToken={maticStakingToken}
              rewardsToken={rewardsToken}
              stakingRewards={maticStakingRewards}
              key={maticStakingToken?.symbol}
            />
          )}
        {selectedNetwork.slug === ChainSlug.Gnosis &&
          enabledTokens.includes(CanonicalToken.DAI) && (
            <StakeWidget
              network={gnosisNetwork}
              bridge={daiBridge}
              stakingToken={daiStakingToken}
              rewardsToken={rewardsToken}
              stakingRewards={gnosisStakingRewards}
              key={daiStakingToken?.symbol}
            />
          )}
        {enabledTokens.includes(CanonicalToken.USDC) && (
          <StakeWidget
            network={selectedNetwork}
            bridge={usdcBridge}
            stakingToken={usdcStakingToken}
            rewardsToken={rewardsToken}
            stakingRewards={usdcStakingRewards}
            key={usdcStakingToken?.symbol}
          />
        )}

        {selectedNetwork.slug === ChainSlug.Polygon &&
          enabledTokens.includes(CanonicalToken.USDT) && (
            <StakeWidget
              network={polygonNetwork}
              bridge={usdtBridge}
              stakingToken={usdtStakingToken}
              rewardsToken={rewardsToken}
              stakingRewards={usdtStakingRewards}
              key={usdtStakingToken?.symbol}
            />
          )}
      </Div>
    </Flex>
  )
}

export default Stake
