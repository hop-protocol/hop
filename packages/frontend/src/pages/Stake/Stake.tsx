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
    return new Contract('0x5D13179c5fa40b87D53Ff67ca26245D3D5B2F872', stakingRewardsAbi, _provider)
  }, [sdk, provider])

  const rewardsToken = useAsyncMemo(async () => {
    const polygonProvider = await sdk.getSignerOrProvider('polygon')
    const _provider = provider?.network.name === 'polygon' ? provider : polygonProvider

    const token = new Token(
      'mainnet',
      'polygon',
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      6,
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
