import React, { FC } from 'react'
import toHex from 'to-hex'
import { parseUnits } from 'ethers/lib/utils'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { addresses } from 'src/config'
import Token from 'src/models/Token'
import logger from 'src/logger'
import { L1_NETWORK } from 'src/constants'

const useStyles = makeStyles(() => ({
  root: {},
  stepButton: {
    marginBottom: '2.8rem'
  }
}))

type Props = {}

const Demo: FC<Props> = () => {
  const styles = useStyles()
  const { provider } = useWeb3Context()
  const app = useApp()
  const token = app?.tokens.find(token => token.symbol === 'DAI') as Token
  const l1Dai =
    app?.contracts?.tokens[token.symbol][L1_NETWORK].l1CanonicalToken
  const l1Bridge = app?.contracts?.tokens[token.symbol][L1_NETWORK].l1Bridge
  const arbitrumUniswapRouter =
    app?.contracts?.tokens[token.symbol].arbitrum.uniswapRouter

  const handleApprove = async () => {
    const signer = provider?.getSigner()
    const tx = await signer?.sendTransaction({
      to: addresses.tokens[token.symbol][L1_NETWORK].l1CanonicalToken,
      value: toHex('0', { addPrefix: true }),
      gasLimit: toHex('1000000', { addPrefix: true }),
      gasPrice: toHex('10000000000', { addPrefix: true }),
      data:
        '0x095ea7b3000000000000000000000000' +
        addresses.tokens[token.symbol][L1_NETWORK].l1Bridge
          .toLowerCase()
          .replace('0x', '') +
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    })

    logger.debug('TX', tx?.hash)
  }

  const handleSend = async () => {
    const signer = provider?.getSigner()
    const recipient = await signer?.getAddress()
    const messengerId =
      '0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de'
    const amount = parseUnits('5000', 18)
    const tx = await l1Bridge?.sendToL2(messengerId, recipient, amount, {
      value: toHex('0', { addPrefix: true }),
      gasLimit: toHex('2000000', { addPrefix: true }),
      gasPrice: toHex('10000000000', { addPrefix: true })
    })

    logger.debug('TX', tx?.hash)
  }

  const handleSwap = async () => {
    const signer = provider?.getSigner()
    const recipient = await signer?.getAddress()
    const messengerId =
      '0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de'
    const amountOutMin = '0'
    const amount = parseUnits('10', 18)
    const tx = await l1Bridge?.sendToL2AndAttemptSwap(
      messengerId,
      recipient,
      amount,
      amountOutMin,
      {
        value: toHex('0', { addPrefix: true }),
        gasLimit: toHex('2000000', { addPrefix: true }),
        gasPrice: toHex('10000000000', { addPrefix: true })
      }
    )

    logger.debug('TX', tx?.hash)
  }

  const handleL2UniswapSwap = async () => {
    const signer = provider?.getSigner()
    const recipient = await signer?.getAddress()
    const amountIn = parseUnits('20', 18)
    const amountOutMin = '0'
    const path = [
      addresses.tokens[token.symbol].arbitrum.l2Bridge,
      addresses.tokens[token.symbol].arbitrum.l2CanonicalToken
    ]
    const to = recipient
    const deadline = (Date.now() / 1000 + 300) | 0

    const tx = await arbitrumUniswapRouter?.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    )

    logger.debug('TX', tx?.hash)
  }

  const handleMintDai = async () => {
    const signer = provider?.getSigner()
    const recipient = await signer?.getAddress()
    const amount = parseUnits('10', 18)
    const tx = await l1Dai?.mint(recipient, amount)

    logger.debug('TX', tx?.hash)
  }

  return (
    <Box
      className={styles.root}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Button
        className={styles.stepButton}
        onClick={handleApprove}
        large
        highlighted
      >
        Approve token
      </Button>
      <Button
        className={styles.stepButton}
        onClick={handleSend}
        large
        highlighted
      >
        Send to L2 (no swap)
      </Button>
      <Button
        className={styles.stepButton}
        onClick={handleSwap}
        large
        highlighted
      >
        Send to L2 (swap)
      </Button>
      <Button
        className={styles.stepButton}
        onClick={handleL2UniswapSwap}
        large
        highlighted
      >
        L2 Uniswap swap
      </Button>
      <Button
        className={styles.stepButton}
        onClick={handleMintDai}
        large
        highlighted
      >
        Mint Kovan DAI
      </Button>
    </Box>
  )
}

export default Demo
