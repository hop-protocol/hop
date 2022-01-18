import React from 'react'
import { Div } from '../ui'
import { Link as MuiLink } from '@material-ui/core'

export function ExternalLink(props) {
  const { href, text, linkText, postText } = props

  if (linkText) {
    return (
      <Div>
        {text}&nbsp;
        <MuiLink target="_blank" rel="noopener noreferrer" href={href}>
          {linkText}
        </MuiLink>
        &nbsp;{postText}
      </Div>
    )
  }

  return <MuiLink target="_blank" rel="noopener noreferrer" href={href} />
}

export function Link(props) {
  return <MuiLink {...props} />
}
