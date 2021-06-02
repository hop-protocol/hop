import React, { FC, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MuiButton from '@material-ui/core/Button'
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
    selectedToken,
    sourceNetwork,
    destNetwork,
    sourceTokenAmount,
    setSourceTokenAmount,
    setDestTokenAmount,
    destTokenAmount,
    calcAltTokenAmount,
    sourceBalance,
    loadingSourceBalance,
    destBalance,
    loadingDestBalance,
    switchDirection,
    error,
    setError,
    tx,
    setTx
  } = useConvert()

  useEffect(() => {
    setSourceTokenAmount('')
    setDestTokenAmount('')
  }, [setSourceTokenAmount, setDestTokenAmount])

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
        title={sourceNetwork?.name}
        titleIconUrl={sourceNetwork?.imageUrl}
        balance={sourceBalance}
        loadingBalance={loadingSourceBalance}
      />
      <MuiButton
        className={styles.switchDirectionButton}
        onClick={switchDirection}
      >
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </MuiButton>
      <AmountSelectorCard
        className={styles.lastSelector}
        value={destTokenAmount as string}
        token={selectedToken}
        label={'To'}
        onChange={handleDestTokenAmountChange}
        title={destNetwork?.name}
        titleIconUrl={destNetwork?.imageUrl}
        balance={destBalance}
        loadingBalance={loadingDestBalance}
      />
      <Alert severity="error" onClose={() => setError(undefined)} text={error} />
      <TxStatusModal
        onClose={handleTxStatusClose}
        tx={tx} />
      <SendButton />
    </Box>
  )
}

export default Convert
