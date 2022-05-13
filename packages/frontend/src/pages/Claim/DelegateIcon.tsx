import React, { useState, useEffect } from 'react'

import { Circle, Icon } from 'src/components/ui'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

let imagesLoadedCache :any = null

export function DelegateIcon (props: any) {
  const { delegate } = props
  const [error, setError] = useState(imagesLoadedCache ? !imagesLoadedCache[delegate?.avatar] : false)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!imagesLoadedCache) {
        imagesLoadedCache = {}
      }
      if (!imagesLoadedCache[delegate.avatar]) {
        setError(true)
      }
    }, 2 * 1000)
    return () => {
      clearTimeout(t)
    }
  }, [])

  return (
    <Circle style={{ background: '#fff', border: '1px solid #fff' }} width={45} height={45}>
      {(delegate.avatar && !error) && (
        <Icon src={delegate.avatar} width={45} alt={delegate?.ensName?.substr(0, 2) || '?'} style={{ fontSize: '2rem' }} onError={(event: any) => {
          setError(true)
        }} onLoad={(event: any) => {
          if (!imagesLoadedCache) {
            imagesLoadedCache = {}
          }
          imagesLoadedCache[delegate.avatar] = true
        }} />
      )}
      {(error || (!delegate.avatar && delegate.address)) && (
        <Jazzicon diameter={45} seed={jsNumberForAddress(delegate.address?.address!)} />
      )}
    </Circle>
  )
}
