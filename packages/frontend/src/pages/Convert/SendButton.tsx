import React, { FC } from 'react'
import SendIcon from '@material-ui/icons/Send'
import { makeStyles } from '@material-ui/core/styles'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Button from 'src/components/buttons/Button'

const useStyles = makeStyles(() => ({
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem'
  }
}))

interface Props {}

const SendButton: FC = (props: Props) => {
  const styles = useStyles()
  const { validFormFields, convertTokens, sending } = useConvert()
  const { walletConnected, validConnectedNetworkId } = useWeb3Context()
  const handleSubmit = async () => {
    convertTokens()
  }

  let buttonText = 'Convert'
  if (!walletConnected) {
    buttonText = 'Connect wallet'
  } else if (!validConnectedNetworkId) {
    buttonText = 'Change network'
  }

  return (
    <Button
      className={styles.sendButton}
      startIcon={validFormFields && <SendIcon />}
      onClick={handleSubmit}
      disabled={!validFormFields}
      loading={sending}
      large
      highlighted
    >
      {buttonText}
    </Button>
  )
}

export default SendButton
