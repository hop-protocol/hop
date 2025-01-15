import { Tokens } from './Tokens'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Tokens',
}

export default async function DetailsPage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <Tokens />
    </Suspense>
  )
}
