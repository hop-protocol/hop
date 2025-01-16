import { Stats } from './Stats'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Stats',
}

export default async function StatsPage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <Stats />
    </Suspense>
  )
}
