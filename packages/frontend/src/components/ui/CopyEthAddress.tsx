import Box from '@mui/material/Box'
import MuiTooltip from '@mui/material/Tooltip'
import React, { SyntheticEvent, useState } from 'react'
import { EthAddress, EthAddressProps } from 'src/components/ui/EthAddress'
import { withStyles } from '@mui/styles'

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

  function handleClick(event: SyntheticEvent<any>) {
    try {
      const { text } = event.currentTarget.dataset
      navigator.clipboard.writeText(text)
    } catch (err: any) {
      console.error(err)
    }
    if (!value) {
      return
    }
    setText('copied!')
    setTimeout(() => {
      setText('')
    }, 1 * 1000)
  }

  return (
    <Tooltip title={text} open={!!text} placement="top-start">
      <Box data-text={value} onClick={handleClick}>
        <Box style={{ cursor: "pointer" }}>
          <EthAddress {...rest} value={value} />
        </Box>
      </Box>
    </Tooltip>
  )
}
