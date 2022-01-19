import React, { FC, useMemo } from 'react'
import { Contract } from 'ethers'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Token, CanonicalToken, WrappedToken } from '@hop-protocol/sdk'
import { stakingRewardsAbi } from '@hop-protocol/core/abi'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import StakeWidget from 'src/pages/Stake/StakeWidget'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { isMainnet } from 'src/config'
import { Flex } from 'src/components/ui'

const useStyles = makeStyles(theme => ({
  container: {
    padding: `${theme.padding.default} 0`,
  },
}))

const Stake: FC = () => {
  const styles = useStyles()

  const { bridges, sdk, networks, user, tokens } = useApp()
  const { provider } = useWeb3Context()

  const stakingContracts = {
    USDC: '0x2C2Ab81Cf235e86374468b387e241DF22459A265',
    USDT: '0x07932e9A5AB8800922B2688FB1FA0DAAd8341772',
    MATIC: '0x7dEEbCaD1416110022F444B03aEb1D20eB4Ea53f',
    ETH: '0x7bceda1db99d64f25efa279bb11ce48e15fda427',
  }

  // ETH

  const ethBridge = useAsyncMemo(async () => {
    return bridges.find(bridge => bridge.getTokenSymbol() === 'ETH')
  }, [bridges])

  const ethStakingToken = useAsyncMemo(async () => {
    return ethBridge?.getSaddleLpToken('polygon')
  }, [ethBridge])

  const ethStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'eth' ? provider : polygonProvider
    return new Contract(stakingContracts.ETH, stakingRewardsAbi, _provider)
  }, [sdk, provider, user])

  // MATIC

  const maticBridge = useAsyncMemo(async () => {
    return bridges.find(bridge => bridge.getTokenSymbol() === 'MATIC')
  }, [bridges])

  const maticStakingToken = useAsyncMemo(async () => {
    return maticBridge?.getSaddleLpToken('polygon')
  }, [maticBridge])

  const maticStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'matic' ? provider : polygonProvider
    return new Contract(stakingContracts.MATIC, stakingRewardsAbi, _provider)
  }, [sdk, provider, user])

  // USDC

  const usdcBridge = useAsyncMemo(async () => {
    return bridges.find(bridge => bridge.getTokenSymbol() === 'USDC')
  }, [bridges])

  const usdcStakingToken = useAsyncMemo(async () => {
    return usdcBridge?.getSaddleLpToken('polygon')
  }, [usdcBridge])

  const usdcStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'matic' ? provider : polygonProvider
    return new Contract(stakingContracts.USDC, stakingRewardsAbi, _provider)
  }, [sdk, provider, user])

  // USDT

  const usdtBridge = useAsyncMemo(async () => {
    return bridges.find(bridge => bridge.getTokenSymbol() === 'USDT')
  }, [bridges])

  const usdtStakingToken = useAsyncMemo(async () => {
    return usdtBridge?.getSaddleLpToken('polygon')
  }, [usdtBridge])

  const usdtStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'matic' ? provider : polygonProvider
    return new Contract(stakingContracts.USDT, stakingRewardsAbi, _provider)
  }, [sdk, provider, user])

  const rewardsToken = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'polygon' ? provider : polygonProvider

    const token = new Token(
      'mainnet',
      'polygon',
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      18,
      WrappedToken.WMATIC,
      'Wrapped Matic',
      '',
      _provider
    )

    return token
  }, [sdk, provider])

  const polygonNetwork = useMemo(() => {
    return networks.find(network => {
      return network.slug === 'polygon'
    })
  }, [networks])

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
      <div className={styles.container}>
        {enabledTokens.includes(CanonicalToken.ETH) && (
          <StakeWidget
            network={polygonNetwork}
            bridge={ethBridge}
            stakingToken={ethStakingToken}
            rewardsToken={rewardsToken}
            stakingRewards={ethStakingRewards}
            key={ethStakingToken?.symbol}
          />
        )}
        {enabledTokens.includes(CanonicalToken.MATIC) && (
          <StakeWidget
            network={polygonNetwork}
            bridge={maticBridge}
            stakingToken={maticStakingToken}
            rewardsToken={rewardsToken}
            stakingRewards={maticStakingRewards}
            key={maticStakingToken?.symbol}
          />
        )}
        {enabledTokens.includes(CanonicalToken.USDC) && (
          <StakeWidget
            network={polygonNetwork}
            bridge={usdcBridge}
            stakingToken={usdcStakingToken}
            rewardsToken={rewardsToken}
            stakingRewards={usdcStakingRewards}
            key={usdcStakingToken?.symbol}
          />
        )}
        {enabledTokens.includes(CanonicalToken.USDT) && (
          <StakeWidget
            network={polygonNetwork}
            bridge={usdtBridge}
            stakingToken={usdtStakingToken}
            rewardsToken={rewardsToken}
            stakingRewards={usdtStakingRewards}
            key={usdtStakingToken?.symbol}
          />
        )}
      </div>
    </Flex>
  )
}

export default Stake
