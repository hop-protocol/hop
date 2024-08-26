import { Prices } from './Prices'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Token Prices',
}

export default async function DetailsPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Prices />
    </Suspense>
  )
}
