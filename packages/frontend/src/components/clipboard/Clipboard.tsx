import React, { useState, SyntheticEvent } from 'react'
import copy from 'copy-to-clipboard'
import { makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({}))

export interface Props {
  value: string | undefined
  children: any
}

function Clipboard (props: Props) {
  const { value } = props
  const styles = useStyles()

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault()
    if (!value) {
      return
    }
    copy(value)
  }

  return <div onClick={handleClick}>{props.children}</div>
}

export default Clipboard
