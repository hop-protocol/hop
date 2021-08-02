import React, { FC, useState, useEffect, useMemo } from 'react'
import { Contract } from 'ethers'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Token } from '@hop-protocol/sdk'
import { stakingRewardsAbi } from '@hop-protocol/abi'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import StakeWidget from 'src/pages/Stake/StakeWidget'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { isMainnet } from 'src/config'

const useStyles = makeStyles(theme => ({
  container: {
    padding: `${theme.padding.thick} 0`
  }
}))

const Stake: FC = () => {
  const styles = useStyles()

  const { bridges, sdk, networks, user, tokens } = useApp()
  const { provider } = useWeb3Context()

  const usdcStakingToken = useAsyncMemo(async () => {
    const bridge = bridges.find(bridge =>
      bridge.getTokenSymbol() === 'USDC'
    )

    return bridge?.getSaddleLpToken('polygon')
  }, [bridges])

  const usdcStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'matic' ? provider : polygonProvider
    return new Contract('0x2C2Ab81Cf235e86374468b387e241DF22459A265', stakingRewardsAbi, _provider)
  }, [sdk, provider, user])

  const usdtStakingToken = useAsyncMemo(async () => {
    const bridge = bridges.find(bridge =>
      bridge.getTokenSymbol() === 'USDT'
    )

    const LP = await bridge?.getSaddleLpToken('polygon')
    return LP
  }, [bridges])

  const usdtStakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'matic' ? provider : polygonProvider
    return new Contract('0xCB784a097f33231f2D3a1E22B236a9D2c878555d', stakingRewardsAbi, _provider)
  }, [sdk, provider, user])

  const rewardsToken = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'polygon' ? provider : polygonProvider

    const token = new Token(
      'mainnet',
      'polygon',
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      18,
      'WMATIC',
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
        <Typography variant="h4">
          Coming soon
        </Typography>
      </Box>
    )
  }

  const enabledTokens = tokens.map(token => token.symbol)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4">
        Stake
      </Typography>
      <div className={styles.container}>
      {enabledTokens.includes('USDC') &&
        <StakeWidget
          network={polygonNetwork}
          stakingToken={usdcStakingToken}
          rewardsToken={rewardsToken}
          stakingRewards={usdcStakingRewards}
          key={usdcStakingToken?.symbol}
        />
      }
      {enabledTokens.includes('USDT') &&
        <StakeWidget
          network={polygonNetwork}
          stakingToken={usdtStakingToken}
          rewardsToken={rewardsToken}
          stakingRewards={usdtStakingRewards}
          key={usdtStakingToken?.symbol}
        />
      }
      </div>
    </Box>
  )
}

export default Stake
