import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '../components/buttons/Button'
import { useWeb3Context } from '../contexts/Web3Context'

import toHex from 'to-hex'

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

  return (
    <Box className={styles.root} display="flex" flexDirection="column" alignItems="center">
      <Button
        className={styles.stepButton}
        onClick={async () => {
          const signer = provider?.getSigner()
          const daiAddress = '0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9'
          await signer?.sendTransaction({
            to: daiAddress,
            value: toHex('0', { addPrefix: true }),
            gasLimit: toHex('1000000', { addPrefix: true }),
            gasPrice: toHex('10000000000', { addPrefix: true }),
            data: '0x095ea7b3000000000000000000000000c9898e162b6a43dc665b033f1ef6b2bc7b0157b4ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
          })
          console.log('after')
        }}
        large
        highlighted
      >
        Approve token
      </Button>
      <Button
        className={styles.stepButton}
        onClick={async () => {
          const signer = provider?.getSigner()
          const bridgeAddress = '0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4'
          await signer?.sendTransaction({
            to: bridgeAddress,
            value: toHex('0', { addPrefix: true }),
            gasLimit: toHex('1000000', { addPrefix: true }),
            gasPrice: toHex('10000000000', { addPrefix: true }),
            data: '0xb285f05b9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de00000000000000000000000092e5a4b202f57b3634d6352fbabba9cf2908a14a0000000000000000000000000000000000000000000000000de0b6b3a7640000'
          })
          console.log('after')
        }}
        large
        highlighted
      >
        Send to L2 (no swap)
      </Button>
      <Button
        className={styles.stepButton}
        onClick={async () => {
          const signer = provider?.getSigner()
          const bridgeAddress = '0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4'
          await signer?.sendTransaction({
            to: bridgeAddress,
            value: toHex('0', { addPrefix: true }),
            gasLimit: toHex('1000000', { addPrefix: true }),
            gasPrice: toHex('10000000000', { addPrefix: true }),
            data: '0x7f620ce19186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de00000000000000000000000092e5a4b202f57b3634d6352fbabba9cf2908a14a00000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000000'
          })
          console.log('after')
        }}
        large
        highlighted
      >
        Send to L2 and Swap
      </Button>
    </Box>
  )
}

export default Demo