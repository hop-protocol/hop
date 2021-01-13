import React, { FC, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MuiButton from '@material-ui/core/Button'
import Network from 'src/models/Network'
import SendButton from 'src/pages/Convert/SendButton'
import AmountSelectorCard from 'src/pages/Convert/AmountSelectorCard'
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
  }
}))

const Convert: FC = () => {
  const styles = useStyles()
  const {
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
    setDestTokenBalance
  } = useConvert()

  useEffect(() => {
    setSourceNetwork(
      sourceNetworks.find(
        (network: Network) => network?.slug === 'kovan'
      ) as Network
    )
    setDestNetwork(
      sourceNetworks.find(
        (network: Network) => network?.slug === 'arbitrum'
      ) as Network
    )
  }, [setSourceNetwork, setDestNetwork, sourceNetworks])

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
        value={destTokenAmount as string}
        token={selectedToken}
        label={'To'}
        onChange={handleDestTokenAmountChange}
        selectedNetwork={destNetwork}
        onBalanceChange={setDestTokenBalance}
      />
      <SendButton />
    </Box>
  )
}

export default Convert
