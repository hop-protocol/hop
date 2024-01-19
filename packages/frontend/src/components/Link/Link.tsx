import Box from '@material-ui/core/Box'
import MuiLink, { LinkProps } from '@material-ui/core/Link'
import React from 'react'

interface Props {
  style?: any
  href?: string
  text?: string
  linkText?: string
  postText?: string
  children?: any
  color?: string
}

export function ExternalLink(props: Props) {
  const { href, text, linkText, postText, style, children } = props

  if (!text) {
    return (
      <MuiLink style={style} target="_blank" rel="noopener noreferrer" href={href}>
        {children}
      </MuiLink>
    )
  }

  return (
    <Box>
      {text}
      {linkText && (
        <>
          &nbsp;
          <MuiLink style={style} target="_blank" rel="noopener noreferrer" href={href}>
            {linkText}
          </MuiLink>
          &nbsp;
        </>
      )}
      {postText}
    </Box>
  )
}

export function Link(props: Props & LinkProps) {
  return <MuiLink rel="noopener noreferrer" {...props} />
}
