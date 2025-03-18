import { Bonders } from './Bonders'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Bonders',
}

export default async function BondersPage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <Bonders />
    </Suspense>
  )
}
