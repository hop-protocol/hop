import { Paths } from './Paths'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Paths',
}

export default async function DetailsPage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <Paths />
    </Suspense>
  )
}
