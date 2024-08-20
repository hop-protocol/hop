import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as theme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Box from '@mui/material/Box'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Typography from '@mui/material/Typography'

type Props = {
  code: string
  language?: string
}

export function Syntax (props: Props) {
  let { code, language } = props
  const [copied, setCopied] = useState(false)
  if (!language) {
    language = 'javascript'
  }

  function handleCopy () {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Box width="100%">
      <Box display="flex" flexDirection="column">
        <SyntaxHighlighter
          language={language}
          style={theme}
          showLineNumbers={true}
          overflow="auto"
          lineProps={{
            style: {
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap'
            }
          }}
          wrapLines={true}
        >{code}</SyntaxHighlighter>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <CopyToClipboard text={code}
          onCopy={handleCopy}>
          <Typography variant="body2" style={{ cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </Typography>
        </CopyToClipboard>
      </Box>
    </Box>
  )
}
