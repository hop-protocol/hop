import React, { FC } from 'react'
import SendIcon from '@material-ui/icons/Send'
import { makeStyles } from '@material-ui/core/styles'
import Button from 'src/components/buttons/Button'

const useStyles = makeStyles(() => ({
  sendButton: {
    marginTop: '1rem',
    width: '30.0rem'
  }
}))

type Props = {
  disabled: boolean
  sending: boolean
  onClick: () => void
}

const SendButton: FC<Props> = props => {
  const styles = useStyles()
  const { disabled, sending, onClick, children } = props
  const handleSubmit = async () => {
    onClick()
  }

  return (
    <Button
      className={styles.sendButton}
      startIcon={!disabled && <SendIcon />}
      onClick={handleSubmit}
      disabled={disabled}
      loading={sending}
      large
      highlighted
    >
      {children}
    </Button>
  )
}

export default SendButton
