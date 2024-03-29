import Box from '@mui/material/Box'
import React from 'react'

export function TokenIcon(props: any) {
  let { src, alt = '', title = '', width, inline, bgTransparent } = props
  if (!src) {
    return null
  }
  title = title || alt
  const isLpToken = alt?.endsWith('LP')
  const isHToken = alt?.startsWith('h')
  const showRing = isHToken || isLpToken

  return (
    <Box display={inline ? "inline-flex" : "flex"} justifyContent="center" alignItems="center" width={width} style={{
      boxSizing: 'border-box',
      padding: showRing ? '0.3rem' : 0,
      borderRadius: '50%',
      background: showRing ? 'linear-gradient(99.85deg, #B32EFF -18.29%, #F2A498 109.86%)' : 'none',
    }}>
      <img width="100%" src={src} alt={alt} title={title} style={{
        background: bgTransparent ? 'none' : '#fff',
        borderRadius: '50%'
      }} />
    </Box>
  )
}
