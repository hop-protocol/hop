import React, { useState, ReactNode } from 'react'
import { CopyToClipboard } from './CopyToClipboard.js'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

type Props = {
  text: string
  children?: ReactNode
}

export function CopyToClipboardText (props: Props) {
  const { text, children } = props

  const [copied, setCopied] = useState('')
  const [copiedKey, setCopiedKey] = useState('')
  const [key] = useState(Math.random().toString(36).substring(7))

  function handleCopy (value: string, key: string) {
    setCopied(value)
    setCopiedKey(key)
    setTimeout(() => {
      setCopied('')
      setCopiedKey('')
    }, 1000)
  }

  return (
    <Box display="flex" alignItems="Center">
      {children ?? text}
      <CopyToClipboard text={text} key={key}
        onCopy={event => handleCopy(text, key)}>
        <Typography variant="body2" style={{ cursor: 'pointer' }}>
          {copiedKey === key ? '✅' : '📋'}
        </Typography>
      </CopyToClipboard>
    </Box>
  )
}
