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

const useStyles = makeStyles(theme => ({
  container: {
    padding: `${theme.padding.thick} 0`
  }
}))

const Stake: FC = () => {
  const styles = useStyles()

  const { bridges, sdk, networks } = useApp()
  const { provider } = useWeb3Context()
  const [stakingTokens, setStakingTokens] = useState<Token[]>()

  useEffect(() => {
    const fetchRewardsTokens = async () => {
      const bridge = bridges.find(bridge =>
        bridge.getTokenSymbol() === 'USDC'
      )

      const tokens: Token[] = []
      const lpToken = await bridge?.getSaddleLpToken('polygon')
      if (lpToken) {
        tokens.push(lpToken)
      }

      setStakingTokens(tokens)
    }

    fetchRewardsTokens()
  }, [bridges])

  const stakingRewards = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'polygon' ? provider : polygonProvider
    return new Contract('0x20E145F873EaaAe46f69C98B7cE1f4BB8cC9644B', stakingRewardsAbi, _provider)
  }, [sdk, provider])

  const rewardsToken = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'polygon' ? provider : polygonProvider

    const token = new Token(
      'goerli',
      'polygon',
      '0x101E9d2E3975d29DA9191F5933490a55916135a4',
      6,
      'hUSDC',
      'Hop USDC',
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4">
        Stake
      </Typography>
      <div className={styles.container}>
        {stakingTokens?.map(token => (
          <StakeWidget
            network={polygonNetwork}
            stakingToken={token}
            rewardsToken={rewardsToken}
            stakingRewards={stakingRewards}
            key={token.symbol}
          />
        ))}
      </div>
    </Box>
  )
}

export default Stake
