import React, { FC, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import StakeWidget from 'src/pages/Stake/StakeWidget'

const useStyles = makeStyles(theme => ({
  container: {
    padding: `${theme.padding.thick} 0`
  }
}))

const Stake: FC = () => {
  const styles = useStyles()

  const { bridges } = useApp()
  const [rewardsTokens, setRewardsTokens] = useState<Token[]>()

  useEffect(() => {
    const fetchRewardsTokens = async () => {
      console.log('fetchRewardsTokens')
      const bridge = bridges.find(bridge =>
        bridge.getTokenSymbol() === 'USDC'
      )

      const tokens: Token[] = []
      const lpToken = await bridge?.getSaddleLpToken('polygon')
      if (lpToken) {
        tokens.push(lpToken)
      }

      setRewardsTokens(tokens)
    }

    fetchRewardsTokens()
  }, [bridges])

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4">
        Stake
      </Typography>
      <div className={styles.container}>
        {rewardsTokens?.map(token => (
          <StakeWidget token={token} key={token.symbol}/>
        ))}
      </div>
    </Box>
  )
}

export default Stake
