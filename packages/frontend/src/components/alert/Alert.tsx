import React, { FC } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import MuiAlert, { AlertProps as MuiAlertProps } from '@material-ui/lab/Alert'
import { prettifyErrorMessage } from 'src/utils'

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '16px',
    borderRadius: '12px',
    maxWidth: '440px',
    overflow: 'auto',
  },
}))

type AlertProps = {
  text?: string | null | undefined
}

const Alert: FC<AlertProps & MuiAlertProps> = props => {
  const { text, className, children } = props
  const styles = useStyles()
  const show = text || children

  return show ? (
    <MuiAlert {...props} className={clsx(styles.root, className)}>
      {children || prettifyErrorMessage(text || '')}
    </MuiAlert>
  ) : null
}

export default Alert
