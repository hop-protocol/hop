import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '../components/buttons/Button'
import { useWeb3Context } from '../contexts/Web3Context'

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
          console.log('before')
          const signer = provider?.getSigner()
          console.log('signer: ', signer)
          await signer?.sendTransaction({
            to: '0x816a684f40b8B4B060A4Df7A10caD589Ef64E95e',
            value: 1,
            gasLimit: 21000,
            gasPrice: 10000000000
          })
          console.log('after')
        }}
        large
        highlighted
      >
        Step 1
      </Button>
      <Button
        className={styles.stepButton}
        onClick={() => {
          console.log('step 2')
        }}
        large
        highlighted
      >
        Step 2
      </Button>
      <Button
        className={styles.stepButton}
        onClick={() => {
          console.log('step 3')
        }}
        large
        highlighted
      >
        Step 3
      </Button>
    </Box>
  )
}

export default Demo