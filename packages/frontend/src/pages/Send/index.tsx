import React, { Suspense, lazy } from 'react'
import { Loading } from '../../components/Loading'

const SendComponent = lazy(() => import('./Send'))

const Send: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SendComponent />
    </Suspense>
  )
}

export default Send
