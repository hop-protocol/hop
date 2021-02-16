import React, { FC, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiButton from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import Network from 'src/models/Network'
import AmountSelectorCard from 'src/pages/Convert/AmountSelectorCard'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import SendButton from 'src/pages/Convert/SendButton'
import Alert from 'src/components/alert/Alert'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
  },
  switchDirectionButton: {
    padding: 0,
    minWidth: 0,
    margin: '1.0rem'
  },
  downArrow: {
    margin: '0.8rem',
    height: '2.4rem',
    width: '2.4rem'
  },
  lastSelector: {
    marginBottom: '5.4rem'
  }
}))

const Convert: FC = () => {
  const styles = useStyles()
  let {
    selectedToken,
    sourceNetwork,
    setSourceNetwork,
    sourceNetworks,
    destNetwork,
    setDestNetwork,
    sourceTokenAmount,
    setSourceTokenAmount,
    setDestTokenAmount,
    destTokenAmount,
    calcAltTokenAmount,
    setSourceTokenBalance,
    setDestTokenBalance,
    networkPairMap,
    error,
    setError
  } = useConvert()
  useEffect(() => {
    setSourceTokenAmount('')
    setDestTokenAmount('')
  }, [setSourceTokenAmount, setDestTokenAmount])

  const handleSwitchDirection = () => {
    destNetwork && setSourceNetwork(destNetwork)
    sourceNetwork && setDestNetwork(sourceNetwork)
    destTokenAmount && setSourceTokenAmount(destTokenAmount)
  }
  const handleSourceTokenAmountChange = async (event: any) => {
    try {
      const value = event.target.value || ''
      setSourceTokenAmount(value)
      setDestTokenAmount(await calcAltTokenAmount(value))
    } catch (err) {}
  }
  const handleDestTokenAmountChange = async (event: any) => {
    try {
      const value = event.target.value || ''
      setDestTokenAmount(value)
      setSourceTokenAmount(await calcAltTokenAmount(value))
    } catch (err) {}
  }

  sourceNetworks = sourceNetworks.filter((network: Network) => {
    return (
      !network.isLayer1 &&
      selectedToken?.supportedNetworks.includes(
        network.slug?.replace('HopBridge', '')
      )
    )
  })

  const destNetworks = sourceNetworks.filter((network: Network) => {
    return (
      !network.isLayer1 &&
      selectedToken?.supportedNetworks.includes(
        network.slug?.replace('HopBridge', '')
      )
    )
  })

  useEffect(() => {
    const defaultNetwork = sourceNetworks[0].slug
    if (!sourceNetwork || sourceNetwork.isLayer1) {
      setSourceNetwork(
        sourceNetworks.find(
          (network: Network) => network?.slug === defaultNetwork
        ) as Network
      )
    }
    if (!destNetwork || destNetwork.isLayer1) {
      setDestNetwork(
        sourceNetworks.find(
          (network: Network) => network?.slug === networkPairMap[defaultNetwork]
        ) as Network
      )
    }
  }, [
    setSourceNetwork,
    setDestNetwork,
    sourceNetworks,
    sourceNetwork,
    destNetwork
  ])

  const handleSourceNetworkChange = (network: Network | undefined) => {
    if (network) {
      setSourceNetwork(network)

      const dest = sourceNetworks?.find(
        (net: Network) => net?.slug === networkPairMap[network?.slug]
      )
      if (dest) {
        setDestNetwork(dest)
      }
    }
  }

  const handleDestNetworkChange = (network: Network | undefined) => {
    if (network) {
      setDestNetwork(network)

      const source = sourceNetworks?.find(
        (net: Network) => net?.slug === networkPairMap[network?.slug]
      )
      if (source) {
        setSourceNetwork(source)
      }
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <AmountSelectorCard
        value={sourceTokenAmount as string}
        token={selectedToken}
        label={'From'}
        onChange={handleSourceTokenAmountChange}
        selectedNetwork={sourceNetwork}
        onBalanceChange={setSourceTokenBalance}
        networkOptions={sourceNetworks}
        onNetworkChange={handleSourceNetworkChange}
      />
      <MuiButton
        className={styles.switchDirectionButton}
        onClick={handleSwitchDirection}
      >
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </MuiButton>
      <AmountSelectorCard
        className={styles.lastSelector}
        value={destTokenAmount as string}
        token={selectedToken}
        label={'To'}
        onChange={handleDestTokenAmountChange}
        selectedNetwork={destNetwork}
        onBalanceChange={setDestTokenBalance}
        networkOptions={destNetworks}
        onNetworkChange={handleDestNetworkChange}
      />
      <Alert severity="error" onClose={() => setError(null)} text={error} />
      <SendButton />
    </Box>
  )
}

export default Convert
