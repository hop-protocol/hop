import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiTooltip from '@material-ui/core/Tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Div, EthAddress, EthAddressProps } from '.'

const tooltipStyles = {
  tooltip: {
    fontSize: '1.4rem',
  },
}

const Tooltip = withStyles(tooltipStyles)(MuiTooltip)

export type Props = {
  value: string
}

export function CopyEthAddress(props: Props & EthAddressProps) {
  const { value, ...rest } = props
  const [text, setText] = useState<string>('')

  function handleClick() {
    if (!value) {
      return
    }
    setText('copied!')
    setTimeout(() => {
      setText('')
    }, 1e3)
  }

  return (
    <Tooltip title={text} open={!!text} placement="top-start">
      <CopyToClipboard text={value} onCopy={handleClick}>
        <Div pointer>
          <EthAddress {...rest} value={value} />
        </Div>
      </CopyToClipboard>
    </Tooltip>
  )
}
