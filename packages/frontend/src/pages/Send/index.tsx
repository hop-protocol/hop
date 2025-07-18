import React, { Suspense, lazy } from 'react'
import { Loading } from '#components/Loading/index.js'

const SendComponent = lazy(() => import('./Send.js'))

const Send: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SendComponent />
    </Suspense>
  )
}

export default Send
