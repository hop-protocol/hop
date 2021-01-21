import React, { FC } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import MuiAlert, { AlertProps as MuiAlertProps } from '@material-ui/lab/Alert'
import { prettifyErrorMessage } from 'src/utils'

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '1.6rem',
    borderRadius: '2rem',
    maxWidth: '51.6rem'
  }
}))

type AlertProps = {
  text: string | null | undefined
}

const Alert: FC<AlertProps & MuiAlertProps> = props => {
  const { text, className } = props
  const styles = useStyles()

  return text ? (
    <MuiAlert {...props} className={clsx(styles.root, className)}>
      {prettifyErrorMessage(text)}
    </MuiAlert>
  ) : null
}

export default Alert
