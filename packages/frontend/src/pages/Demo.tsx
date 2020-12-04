import React, { FC } from 'react'
import { Contract } from 'ethers'
import toHex from 'to-hex'
import { parseUnits } from 'ethers/lib/utils'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'

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

  const handleApprove = async () => {
    const signer = provider?.getSigner()
    const tx = await signer?.sendTransaction({
      to: addresses.l1Dai,
      value: toHex('0', { addPrefix: true }),
      gasLimit: toHex('1000000', { addPrefix: true }),
      gasPrice: toHex('10000000000', { addPrefix: true }),
      data:
        '0x095ea7b3000000000000000000000000' +
        addresses.l1Bridge.toLowerCase().replace('0x', '') +
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    })

    console.log('TX', tx?.hash)
  }

  const handleSend = async () => {
    const signer = provider?.getSigner()
    const recipient = await signer?.getAddress()

    const l1_bridge = new Contract(
      addresses.l1Bridge,
      l1BridgeArtifact.abi,
      signer
    )

    const messengerId =
      '0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de'
    const amount = parseUnits('5000', 18)
    const tx = await l1_bridge.sendToL2(messengerId, recipient, amount, {
      value: toHex('0', { addPrefix: true }),
      gasLimit: toHex('2000000', { addPrefix: true }),
      gasPrice: toHex('10000000000', { addPrefix: true })
    })

    console.log('TX', tx?.hash)
  }

  const handleSwap = async () => {
    const signer = provider?.getSigner()

    const l1_bridge = new Contract(
      addresses.l1Bridge,
      l1BridgeArtifact.abi,
      signer
    )

    const recipient = await signer?.getAddress()
    const messengerId =
      '0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de'
    const amountOutMin = '0'
    const amount = parseUnits('10', 18)
    const tx = await l1_bridge.sendToL2AndAttemptSwap(
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

    console.log('TX', tx?.hash)
  }

  const handleL2UniswapSwap = async () => {
    const signer = provider?.getSigner()

    const router = new Contract(
      addresses.arbitrumUniswapRouter,
      uniswapRouterArtifact.abi,
      signer
    )

    const recipient = await signer?.getAddress()
    const amountIn = parseUnits('20', 18)
    const amountOutMin = '0'
    const path = [addresses.arbitrumBridge, addresses.arbitrumDai]
    const to = recipient
    const deadline = (Date.now() / 1000 + 300) | 0

    const tx = await router.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    )

    console.log('TX', tx?.hash)
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
    </Box>
  )
}

export default Demo
