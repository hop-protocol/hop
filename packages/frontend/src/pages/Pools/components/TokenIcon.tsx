import React from 'react'
import Box from '@material-ui/core/Box'

export function TokenIcon(props: any) {
  let { src, alt = '', title = '', width } = props
  if (!src) {
    return null
  }
  title = title || alt
  const isLpToken = alt?.endsWith('LP')
  const isHToken = alt?.startsWith('h')
  const showRing = isHToken || isLpToken

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width={width} style={{
      boxSizing: 'border-box',
      padding: showRing ? '4px' : 0,
      borderRadius: '50%',
      background: showRing ? 'linear-gradient(99.85deg, #089E71 -18.29%, #F2A498 109.86%)' : 'none'
    }}>
      <img width="100%" src={src} alt={alt} title={title} style={{
        background: '#fff',
        borderRadius: '50%'
      }} />
    </Box>
  )
}
