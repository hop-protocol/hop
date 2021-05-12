import React, { FC, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MuiButton from '@material-ui/core/Button'
import Network from 'src/models/Network'
import SendButton from 'src/pages/Convert/SendButton'
import AmountSelectorCard from 'src/pages/Convert/AmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/txStatus/TxStatusModal'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import { normalizeNumberInput } from 'src/utils'

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
  const {
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
    setError,
    tx,
    setTx
  } = useConvert()

  useEffect(() => {
    setSourceTokenAmount('')
    setDestTokenAmount('')
  }, [setSourceTokenAmount, setDestTokenAmount])

  useEffect(() => {
    setSourceNetwork(networks[0])
    const dest = networks.filter((network: Network) => {
      return (
        network.slug.includes('Bridge') &&
        network?.slug?.includes(selectedNetwork?.slug ?? '')
      )
    })
    setDestNetwork(dest[0])
  }, [networks, selectedNetwork])

  const handleSwitchDirection = () => {
    destNetwork && setSourceNetwork(destNetwork)
    sourceNetwork && setDestNetwork(sourceNetwork)
    destTokenAmount && setSourceTokenAmount(destTokenAmount)
  }
  const handleSourceTokenAmountChange = async (value: string) => {
    try {
      const amount = normalizeNumberInput(value)
      setSourceTokenAmount(amount)
      setDestTokenAmount(await calcAltTokenAmount(amount))
    } catch (err) {}
  }
  const handleDestTokenAmountChange = async (value: string) => {
    try {
      const amount = normalizeNumberInput(value)
      setDestTokenAmount(amount)
      setSourceTokenAmount(await calcAltTokenAmount(amount))
    } catch (err) {}
  }
  const handleTxStatusClose = () => {
    setTx(undefined)
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
      <TxStatusModal
        onClose={handleTxStatusClose}
        tx={tx} />
      <SendButton />
    </Box>
  )
}

export default Convert
