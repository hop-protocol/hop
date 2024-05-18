import MuiAlert, { AlertProps as MuiAlertProps } from '@mui/material/Alert'
import React, { FC } from 'react'
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
}

export const Alert: FC<AlertProps & MuiAlertProps> = props => {
  const { text, className, children, maxWidth } = props
  const styles = useStyles({ maxWidth })
  const show = text ?? children

  return show ? (
    <MuiAlert {...props} className={clsx(styles.root, className)}>
      {children ?? prettifyErrorMessage(text ?? '')}
    </MuiAlert>
  ) : null
}
