import React, { FC } from 'react'
import SendIcon from '@material-ui/icons/Send'
import { makeStyles } from '@material-ui/core/styles'
import { usePools } from 'src/pages/Pools/PoolsContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Button from 'src/components/buttons/Button'

const useStyles = makeStyles(() => ({
  sendButton: {
    marginTop: '1rem',
    width: '30.0rem',
  },
}))

type Props = {}

const SendButton: FC<Props> = (props: Props) => {
  const styles = useStyles()
  const { validFormFields, addLiquidity, sending, sendButtonText, unsupportedAsset } = usePools()
  const { walletConnected } = useWeb3Context()
  const handleSubmit = async () => {
    addLiquidity()
  }

  let buttonText = sendButtonText
  if (!walletConnected) {
    buttonText = 'Connect wallet'
  }

  return (
    <Button
      className={styles.sendButton}
      startIcon={validFormFields && <SendIcon />}
      onClick={handleSubmit}
      disabled={!validFormFields || unsupportedAsset}
      loading={sending}
      large
      highlighted
      fullWidth
    >
      {buttonText}
    </Button>
  )
}

export default SendButton
