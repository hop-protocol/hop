import React, { FC, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MuiButton from '@material-ui/core/Button'
import Network from 'src/models/Network'
import SendButton from 'src/pages/Convert/SendButton'
import AmountSelectorCard from 'src/pages/Convert/AmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import { useConvert } from 'src/pages/Convert/ConvertContext'

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
    sourceNetworks,
    setSourceNetwork,
    destNetwork,
    setDestNetwork,
    sourceTokenAmount,
    setSourceTokenAmount,
    setDestTokenAmount,
    destTokenAmount,
    calcAltTokenAmount,
    setSourceTokenBalance,
    setDestTokenBalance,
    convertHopBridgeNetworks,
    error,
    setError
  } = useConvert()

  useEffect(() => {
    setSourceTokenAmount('')
    setDestTokenAmount('')
  }, [setSourceTokenAmount, setDestTokenAmount])
  useEffect(() => {
    setSourceNetwork(
      sourceNetworks.find(
        (network: Network) => network?.slug === convertHopBridgeNetworks[0]
      ) as Network
    )
    setDestNetwork(
      sourceNetworks.find(
        (network: Network) => network?.slug === convertHopBridgeNetworks[1]
      ) as Network
    )
  }, [setSourceNetwork, setDestNetwork, sourceNetworks])

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

  const destNetworks = sourceNetworks.filter((network: Network) => {
    return convertHopBridgeNetworks.includes(network.slug)
  })
  sourceNetworks = sourceNetworks.filter((network: Network) => {
    return convertHopBridgeNetworks.includes(network.slug)
  })

  const handleSourceNetworkChange = (network: Network | undefined) => {
    if (network) {
      setSourceNetwork(network)

      // check both networks aren't the same
      if (destNetwork === network) {
        setDestNetwork(
          destNetworks[0] === network ? destNetworks[1] : destNetworks[0]
        )

        // only allow L1<>L2
      } else if (!destNetwork?.isLayer1 && !network.isLayer1) {
        setDestNetwork(destNetworks[0])
      }
    }
  }

  const handleDestNetworkChange = (network: Network | undefined) => {
    if (network) {
      setDestNetwork(network)

      // check both networks aren't the same
      if (sourceNetwork === network) {
        setSourceNetwork(
          sourceNetworks[0] === network ? sourceNetworks[1] : sourceNetworks[0]
        )

        // only allow L1<>L2
      } else if (!sourceNetwork?.isLayer1 && !network.isLayer1) {
        setDestNetwork(sourceNetworks[0])
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
