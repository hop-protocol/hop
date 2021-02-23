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
    networks,
    selectedToken,
    selectedNetwork,
    sourceNetwork,
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
    error,
    setError
  } = useConvert()

  useEffect(() => {
    setSourceTokenAmount('')
    setDestTokenAmount('')
  }, [setSourceTokenAmount, setDestTokenAmount])

  useEffect(() => {
    setSourceNetwork(networks[0])
    const destNets = networks.filter((network: Network) => {
      return (
        network.name.includes('Canonical') &&
        network?.slug?.includes(selectedNetwork?.slug ?? '')
      )
    })
    setDestNetwork(destNets[0])
  }, [networks, selectedNetwork])

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

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <AmountSelectorCard
        value={sourceTokenAmount as string}
        token={selectedToken}
        label={'From'}
        onChange={handleSourceTokenAmountChange}
        selectedNetwork={sourceNetwork}
        onBalanceChange={setSourceTokenBalance}
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
      />
      <Alert severity="error" onClose={() => setError(null)} text={error} />
      <SendButton />
    </Box>
  )
}

export default Convert
