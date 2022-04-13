import React, { useMemo } from 'react'
import Typography from '@material-ui/core/Typography'
import { Token, CanonicalToken, WrappedToken, ChainSlug } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import StakeWidget from 'src/pages/Stake/StakeWidget'
import { useSelectedNetwork } from 'src/hooks'
import { rewardTokenAddresses, stakingRewardsContracts } from 'src/config'
import { Div, Flex } from 'src/components/ui'
import { findMatchingBridge } from 'src/utils'
import { StakingRewards, StakingRewards__factory } from '@hop-protocol/core/contracts'
import { RaisedNetworkSelector } from 'src/components/NetworkSelector/RaisedNetworkSelector'
import { useQuery } from 'react-query'

const Stake = () => {
  const { bridges, sdk, networks } = useApp()
  const availableNetworks = networks.filter(n =>
    Object.keys(stakingRewardsContracts).includes(n.slug as ChainSlug)
  )
  const { selectedNetwork, selectBothNetworks } = useSelectedNetwork({
    l2Only: true,
    availableNetworks,
  })

  const allBridges = useMemo(() => {
    return {
      eth: findMatchingBridge(bridges, CanonicalToken.ETH)!,
      matic: findMatchingBridge(bridges, CanonicalToken.MATIC)!,
      dai: findMatchingBridge(bridges, CanonicalToken.DAI)!,
      usdc: findMatchingBridge(bridges, CanonicalToken.USDC)!,
      usdt: findMatchingBridge(bridges, CanonicalToken.USDT)!,
    }
  }, [bridges])

  const stakingTokens = useMemo(() => {
    return {
      eth: allBridges.eth.getSaddleLpToken(selectedNetwork.slug),
      matic: allBridges.matic.getSaddleLpToken(ChainSlug.Polygon),
      dai: allBridges.dai.getSaddleLpToken(selectedNetwork.slug),
      usdc: allBridges.usdc.getSaddleLpToken(selectedNetwork.slug),
      usdt: allBridges.usdt.getSaddleLpToken(selectedNetwork.slug),
    }
  }, [allBridges, selectedNetwork.slug])

  const stakingRewards = useMemo(() => {
    const _provider = sdk.getChainProvider(selectedNetwork.slug)
    const srAddrs = stakingRewardsContracts[selectedNetwork.slug]
    return Object.keys(srAddrs).reduce((acc, tokenSymbol) => {
      const addr = srAddrs[tokenSymbol]
      return {
        ...acc,
        [tokenSymbol.toLowerCase()]: StakingRewards__factory.connect(addr, _provider),
      }
    }, {} as { [key: string]: StakingRewards })
  }, [sdk, selectedNetwork.slug])

  const rewardsToken = useMemo(() => {
    if (selectedNetwork.slug === ChainSlug.Polygon) {
      return new Token(
        'mainnet',
        ChainSlug.Polygon,
        rewardTokenAddresses.WMATIC,
        18,
        WrappedToken.WMATIC,
        'Wrapped Matic',
        ''
      )
    }
    return new Token('mainnet', ChainSlug.Gnosis, rewardTokenAddresses.GNO, 18, 'GNO', 'Gnosis', '')
  }, [selectedNetwork.slug])

  const { data: rewardTokenUsdPrice } = useQuery(
    [`rewardTokenUsdPrice:${selectedNetwork.slug}`, selectedNetwork.slug],
    async () => {
      try {
        const rewardTokenSymbol = selectedNetwork.slug === 'gnosis' ? 'GNO' : 'MATIC'
        const rewardTokenUsdPrice = await allBridges.eth?.priceFeed.getPriceByTokenSymbol(
          rewardTokenSymbol
        )
        return rewardTokenUsdPrice
      } catch (err) {
        console.error(err)
      }
    },
    {
      refetchInterval: 20e3,
    }
  )

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

        {selectedNetwork.slug === ChainSlug.Polygon ? (
          <>
            <StakeWidget
              network={selectedNetwork}
              bridge={allBridges.eth}
              stakingToken={stakingTokens.eth}
              rewardsToken={rewardsToken}
              stakingRewards={stakingRewards?.eth}
              key={stakingTokens.eth?.symbol}
              rewardTokenUsdPrice={rewardTokenUsdPrice}
            />
            <StakeWidget
              network={selectedNetwork}
              bridge={allBridges.matic}
              stakingToken={stakingTokens.matic}
              rewardsToken={rewardsToken}
              stakingRewards={stakingRewards?.matic}
              key={stakingTokens.matic?.symbol}
              rewardTokenUsdPrice={rewardTokenUsdPrice}
            />
            <StakeWidget
              network={selectedNetwork}
              bridge={allBridges.dai}
              stakingToken={stakingTokens.dai}
              rewardsToken={rewardsToken}
              stakingRewards={stakingRewards?.dai}
              key={stakingTokens.dai?.symbol}
              rewardTokenUsdPrice={rewardTokenUsdPrice}
            />
            <StakeWidget
              network={selectedNetwork}
              bridge={allBridges.usdc}
              stakingToken={stakingTokens.usdc}
              rewardsToken={rewardsToken}
              stakingRewards={stakingRewards?.usdc}
              key={stakingTokens.usdc?.symbol}
              rewardTokenUsdPrice={rewardTokenUsdPrice}
            />
            <StakeWidget
              network={selectedNetwork}
              bridge={allBridges.usdt}
              stakingToken={stakingTokens.usdt}
              rewardsToken={rewardsToken}
              stakingRewards={stakingRewards?.usdt}
              key={stakingTokens.usdt?.symbol}
              rewardTokenUsdPrice={rewardTokenUsdPrice}
            />
          </>
        ) : (
          selectedNetwork.slug === ChainSlug.Gnosis && (
            <>
              <StakeWidget
                network={selectedNetwork}
                bridge={allBridges.eth}
                stakingToken={stakingTokens.eth}
                rewardsToken={rewardsToken}
                stakingRewards={stakingRewards?.eth}
                key={stakingTokens.eth?.symbol}
                rewardTokenUsdPrice={rewardTokenUsdPrice}
              />

              <StakeWidget
                network={selectedNetwork}
                bridge={allBridges.dai}
                stakingToken={stakingTokens.dai}
                rewardsToken={rewardsToken}
                stakingRewards={stakingRewards?.dai}
                key={stakingTokens.dai?.symbol}
                rewardTokenUsdPrice={rewardTokenUsdPrice}
              />
              <StakeWidget
                network={selectedNetwork}
                bridge={allBridges.usdc}
                stakingToken={stakingTokens.usdc}
                rewardsToken={rewardsToken}
                stakingRewards={stakingRewards?.usdc}
                key={stakingTokens.usdc?.symbol}
                rewardTokenUsdPrice={rewardTokenUsdPrice}
              />
              <StakeWidget
                network={selectedNetwork}
                bridge={allBridges.usdt}
                stakingToken={stakingTokens.usdt}
                rewardsToken={rewardsToken}
                stakingRewards={stakingRewards?.usdt}
                key={stakingTokens.usdt?.symbol}
                rewardTokenUsdPrice={rewardTokenUsdPrice}
              />
            </>
          )
        )}
      </Div>
    </Flex>
  )
}

export default Stake
