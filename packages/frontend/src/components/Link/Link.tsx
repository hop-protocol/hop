import React from 'react'
import { Div } from '../ui'
import { Link as MuiLink, LinkProps } from '@material-ui/core'

interface Props {
  href?: string
  text?: string
  linkText?: string
  postText?: string
}

export function ExternalLink(props: Props) {
  const { href, text, linkText, postText } = props

  if (!text) {
    return <MuiLink target="_blank" rel="noopener noreferrer" href={href} />
  }

  return (
    <Div>
      {text}
      {linkText && (
        <>
          &nbsp;
          <MuiLink target="_blank" rel="noopener noreferrer" href={href}>
            {linkText}
          </MuiLink>
          &nbsp;
        </>
      )}
      {postText}
    </Div>
  )
}

export function Link(props: LinkProps) {
  return <MuiLink rel="noopener noreferrer" {...props} />
}
