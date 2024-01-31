import MuiTooltip from '@mui/material/Tooltip'
import React, { SyntheticEvent, useState } from 'react'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import { ButtonProps } from '@mui/material/Button'
import { ClipboardIcon } from 'src/components/Button/ClipboardCopyButton/ClipboardIcon'
import { Theme } from '@mui/material/styles'
import { makeStyles, withStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    appearance: 'none',
    border: 0,
    outline: 0,
    padding: '0.1rem',
    margin: 0,
    background: 'none',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  label: {
    marginLeft: '0.5em',
    fontSize: '1.2rem',
    opacity: 0.5,
    '&:hover': {
      opacity: 0.7,
    },
    color: theme.palette.secondary.main,
  },
}))

const tooltipStyles = {
  tooltip: {
    fontSize: '1.4rem',
  },
}

const Tooltip = withStyles(tooltipStyles)(MuiTooltip)

export type Props = ButtonProps & {
  value: string | undefined
  label?: string
}

export function ClipboardCopyButton(props: Props) {
  const { value, label, className } = props
  const styles = useStyles()
  const [text, setText] = useState<string>('')

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault()
    if (!value) {
      return
    }
    copy(value)
    setText('copied!')
    setTimeout(() => {
      setText('')
    }, 3 * 1000)
  }

  return (
    <Tooltip title={text} open={!!text} placement="top-start">
      <button className={clsx(styles.button, className)} onClick={handleClick}>
        <ClipboardIcon />
        {label ? <span className={styles.label}>{label}</span> : null}
      </button>
    </Tooltip>
  )
}
