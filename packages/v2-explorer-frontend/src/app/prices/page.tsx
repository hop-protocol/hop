import { Prices } from './Prices'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Token Prices',
}

export default async function DetailsPage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <Prices />
    </Suspense>
  )
}
