import React, { FC, useState, ChangeEvent, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Price from 'src/models/Price'
import MenuItem from '@material-ui/core/MenuItem'
import AmountSelectorCard from 'src/pages/Pools/AmountSelectorCard'
import { formatEther, parseEther } from 'ethers/lib/utils'
import SendIcon from '@material-ui/icons/Send'
import Button from 'src/components/buttons/Button'
import { usePools } from 'src/pages/Pools/PoolsContext'
import RaisedSelect from 'src/components/selects/RaisedSelect'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
  },
  plusDivider: {
    textAlign: 'center',
    width: '100%',
    height: '2.4rem',
    margin: '2.2rem',
    fontSize: '2rem',
    opacity: '0.5'
  },
  pricesBox: {
    width: '51.6rem',
    marginTop: '4.2rem'
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  pricesCard: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem'
  },
  tokenSelector: {
    marginBottom: '4.4rem'
  },
  textSpacing: {
    padding: '0 1rem'
  }
}))

const Pools: FC = () => {
  const styles = useStyles()
  let {
    networks,
    tokens,
    hToken: ht,
    address,
    totalSupply,
    poolTokenBalance,
    poolReserves,
    addLiquidity
  } = usePools()
  // TODO
  const hToken = ht as Token
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0])
  const [price, setPrice] = useState<string>('0')
  const [invertedPrice, setInvertedPrice] = useState<string>('0')
  const [poolSharePercentage, setPoolSharePercentage] = useState<string>('0')

  const [canonicalTokenAmount, setCanonicalTokenAmount] = useState<string>('')
  const [hopTokenAmount, setHopTokenAmount] = useState<string>('')

  useEffect(() => {
    if (!totalSupply) return
    const canonicalTokenRate = selectedToken.rateForNetwork(selectedNetwork)
    const hTokenRate = hToken.rateForNetwork(selectedNetwork)

    const p = new Price(
      formatEther(canonicalTokenRate),
      formatEther(hTokenRate)
    )
    setPrice(p.toFixed(2))
    setInvertedPrice(p.inverted().toFixed(2))

    if (canonicalTokenAmount && hopTokenAmount) {
      console.log('reserves', poolReserves)
      console.log('total supply', totalSupply)

      const amount0 =
        (Number(canonicalTokenAmount) * Number(totalSupply)) /
        Number(poolReserves[0])
      const amount1 =
        (Number(hopTokenAmount) * Number(totalSupply)) / Number(poolReserves[1])
      const liquidity = Math.min(amount0, amount1)
      const sharePercentage = Math.max(
        Math.min(
          Math.round((liquidity / (Number(totalSupply) + liquidity)) * 100),
          100
        ),
        0
      )
      setPoolSharePercentage(sharePercentage.toString())
    } else {
      setPoolSharePercentage('0')
    }
  }, [
    selectedToken,
    hToken,
    selectedNetwork,
    canonicalTokenAmount,
    totalSupply,
    poolTokenBalance,
    hopTokenAmount,
    poolReserves
  ])

  const handleTokenSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value
    const newSelectedToken = tokens.find(token => token.symbol === tokenSymbol)
    if (newSelectedToken) {
      setSelectedToken(newSelectedToken)
    }
  }

  const handleNetworkSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const networkName = event.target.value
    const newSelectedNetwork = networks.find(
      network => network.slug === networkName
    )
    if (newSelectedNetwork) {
      setSelectedNetwork(newSelectedNetwork)
    }
  }

  const handleSubmit = (event: any) => {
    addLiquidity({
      tokens: [
        {
          token: selectedToken,
          amount: canonicalTokenAmount
        },
        {
          token: hToken,
          amount: hopTokenAmount
        }
      ],
      network: selectedNetwork
    })
  }

  const disabled = !address || !canonicalTokenAmount || !hopTokenAmount

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Add Liquidity
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" className={styles.tokenSelector}>
        <RaisedSelect value={selectedToken.symbol} onChange={handleTokenSelect}>
          {tokens.map(token => (
            <MenuItem value={token.symbol} key={token.symbol}>
              {token.symbol}
            </MenuItem>
          ))}
        </RaisedSelect>
        <Typography
          variant="body1"
          component="span"
          className={styles.textSpacing}
        >
          on
        </Typography>
        <RaisedSelect
          value={selectedNetwork.slug}
          onChange={handleNetworkSelect}
        >
          {networks.map(network => (
            <MenuItem value={network.slug} key={network.slug}>
              {network.name}
            </MenuItem>
          ))}
        </RaisedSelect>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          label="Input"
          title={`${selectedNetwork.name} ${selectedToken.symbol}`}
          token={selectedToken}
          value={canonicalTokenAmount}
          onChange={event => {
            if (!event.target.value) {
              setCanonicalTokenAmount('')
              setHopTokenAmount('')
              return
            }

            setCanonicalTokenAmount(event.target.value)

            try {
              const canonicalTokenAmount = parseEther(event.target.value)
              const hopTokenAmount = canonicalTokenAmount
                .mul(selectedToken.rateForNetwork(selectedNetwork))
                .div(hToken.rateForNetwork(selectedNetwork))
              setHopTokenAmount(formatEther(hopTokenAmount))
            } catch (e) {}
          }}
          selectedNetwork={selectedNetwork}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <div className={styles.plusDivider}>+</div>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          label="Input"
          title={`Hop ${selectedToken.symbol}`}
          token={hToken}
          value={hopTokenAmount}
          onChange={event => {
            if (!event.target.value) {
              setCanonicalTokenAmount('')
              setHopTokenAmount('')
              return
            }

            setHopTokenAmount(event.target.value)

            try {
              const hopTokenAmount = parseEther(event.target.value)
              const canonicalTokenAmount = hopTokenAmount
                .mul(hToken.rateForNetwork(selectedNetwork))
                .div(selectedToken.rateForNetwork(selectedNetwork))
              setCanonicalTokenAmount(formatEther(canonicalTokenAmount))
            } catch (e) {}
          }}
          selectedNetwork={selectedNetwork}
        />
      </Box>
      <Box alignItems="center" className={styles.pricesBox}>
        <Card className={styles.pricesCard}>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              {price}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {hToken.symbol} per{' '}
              <small>{selectedNetwork.slug.substr(0, 3)}</small>
              {selectedToken.symbol}
            </Typography>
          </Box>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              {invertedPrice}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              <small>{selectedNetwork.slug.substr(0, 3)}</small>
              {selectedToken.symbol} per {hToken.symbol}
            </Typography>
          </Box>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              {poolSharePercentage}%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Share of pool
            </Typography>
          </Box>
        </Card>
      </Box>
      <Button
        className={styles.sendButton}
        startIcon={<SendIcon />}
        onClick={handleSubmit}
        large
        highlighted
        disabled={disabled}
      >
        Add liquidity
      </Button>
    </Box>
  )
}

export default Pools
