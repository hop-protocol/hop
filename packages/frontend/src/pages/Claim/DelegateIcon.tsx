import React, { useState, useEffect } from 'react'

import { Circle } from 'src/components/ui/Circle'
import { Icon } from 'src/components/ui/Icon'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const cache:any = {}
const loaded:any = {}
const seen:any = {}

export function DelegateIcon (props: any) {
  const { delegate } = props
  const [loading, setLoading] = useState<boolean>(!loaded[delegate?.avatar])
  const [error, setError] = useState(seen[delegate?.avatar] && loaded[delegate?.avatar] != null ? !loaded[delegate?.avatar] : false)

  useEffect(() => {
    const t = setTimeout(() => {
      if (delegate.avatar) {
        seen[delegate.avatar] = true
        if (!loaded[delegate.avatar]) {
          loaded[delegate.avatar] = false
          setError(true)
        }
      }
    }, 4 * 1000)
    return () => {
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (delegate?.avatar) {
      cache[delegate?.ensName] = delegate.avatar
    }
  }, [delegate?.avatar])

  const avatar = cache[delegate?.ensName] ?? delegate.avatar

  return (
    <Circle style={{ background: '#fff', border: '1px solid #fff' }} width={45} height={45}>
      {(avatar && !error) && (
        <Icon src={avatar} width={45} alt={delegate?.ensName?.substr(0, 2) || '?'} style={{ fontSize: '2rem', display: loading ? 'none' : 'inherit' }} onError={(event: any) => {
          setError(true)
          setLoading(false)
        }} onLoad={(event: any) => {
          setLoading(false)
          loaded[avatar] = true
        }} />
      )}
      {((error || loading || !avatar) && delegate.address) && (
        <Jazzicon diameter={45} seed={jsNumberForAddress(delegate.address?.address!)} />
      )}
    </Circle>
  )
}
