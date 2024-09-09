import MuiAlert, { AlertProps as MuiAlertProps } from '@mui/material/Alert'
import React, { FC, useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { prettifyErrorMessage } from '#utils/index.js'

const useStyles = makeStyles(theme => ({
  root: (props: any) => ({
    fontSize: '1.6rem !important',
    borderRadius: '2rem !important',
    maxWidth: props.maxWidth ? '100% !important' : '51.6rem !important',
    overflow: 'auto !important',
  }),
}))

type AlertProps = {
  text?: string | null | undefined
  maxWidth?: boolean
  severity?: 'error' | 'warning' | 'info' | 'success'
  onClose?: () => void
}

export const Alert: FC<AlertProps & MuiAlertProps> = props => {
  const { text, className, children, severity, onClose, maxWidth } = props
  const styles = useStyles({ maxWidth })
  const [show, setShow] = useState(!!(text ?? children))

  useEffect(() => {
    setShow(!!(text ?? children))
  }, [text, children])

  function handleClose () {
    onClose?.()
    setShow(false)
  }

  return show ? (
    <MuiAlert severity={severity} onClose={handleClose} className={clsx(styles.root, className)}>
      {children ?? prettifyErrorMessage(text ?? '')}
    </MuiAlert>
  ) : null
}
