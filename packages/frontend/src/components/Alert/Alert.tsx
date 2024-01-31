import React, { FC } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import MuiAlert, { AlertProps as MuiAlertProps } from '@mui/lab/Alert'
import { prettifyErrorMessage } from 'src/utils'

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '1.6rem',
    borderRadius: '2rem',
    maxWidth: '51.6rem',
    overflow: 'auto',
  },
}))

type AlertProps = {
  text?: string | null | undefined
}

export const Alert: FC<AlertProps & MuiAlertProps> = props => {
  const { text, className, children } = props
  const styles = useStyles()
  const show = text ?? children

  return show ? (
    <MuiAlert {...props} className={clsx(styles.root, className)}>
      {children ?? prettifyErrorMessage(text ?? '')}
    </MuiAlert>
  ) : null
}
