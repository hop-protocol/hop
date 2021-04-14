import React, { SyntheticEvent } from 'react'
import copy from 'copy-to-clipboard'

export interface Props {
  value: string | undefined
  children: any
}

function Clipboard (props: Props) {
  const { value } = props

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
