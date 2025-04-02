import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Box from '@mui/material/Box'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Typography from '@mui/material/Typography'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

type Props = {
  code: string
  language?: string
  showLineNumbers?: boolean
  title?: string
}

export function Syntax (props: Props) {
  const { code, language = 'javascript', showLineNumbers = true, title } = props
  const [copied, setCopied] = useState(false)
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const isDarkMode = muiTheme.palette.mode === 'dark'
  
  // Choose theme based on dark/light mode
  const codeTheme = isDarkMode ? oneDark : oneLight

  // Custom styles for code highlighting
  const customStyle = {
    borderRadius: '8px',
    padding: isMobile ? '12px' : '16px',
    fontSize: isMobile ? '12px' : '14px',
    margin: 0,
  }

  function handleCopy() {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Box width="100%" position="relative">
      {title && (
        <Box 
          px={2} 
          py={1.5} 
          sx={{
            fontWeight: 500,
            color: isDarkMode ? '#e3e3e3' : '#333',
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
            mb: -0.5,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2" fontWeight={500} fontSize="0.9rem">
            {title}
          </Typography>
        </Box>
      )}
      
      <Box display="flex" flexDirection="column" position="relative">
        <Box 
          position="absolute" 
          right={8} 
          top={8} 
          zIndex={5}
          sx={{
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <CopyToClipboard text={code} onCopy={handleCopy}>
            <Tooltip title={copied ? "Copied!" : "Copy code"} placement="left">
              <IconButton 
                size="small" 
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                  },
                  width: 36,
                  height: 36,
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  borderRadius: '6px',
                }}
              >
                {copied ? 
                  <CheckCircleIcon fontSize="small" color="success" /> : 
                  <ContentCopyIcon fontSize="small" color="action" />
                }
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        </Box>

        <SyntaxHighlighter
          language={language}
          style={codeTheme}
          showLineNumbers={showLineNumbers}
          customStyle={customStyle}
          lineProps={{
            style: {
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
              fontSize: isMobile ? '12px' : '14px',
              fontFamily: '"Roboto Mono", monospace',
              transition: 'background-color 0.2s ease',
              background: 'transparent'
            }
          }}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}
