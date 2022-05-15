import React from 'react'
import { Div } from '../ui'
import { Link as MuiLink, LinkProps } from '@material-ui/core'

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
    <Div>
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
    </Div>
  )
}

export function Link(props: Props & LinkProps) {
  return <MuiLink {...props} />
}
