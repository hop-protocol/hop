import { Analytics } from './Analytics'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Analytics',
}

export default async function AnalyticsPage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <Analytics />
    </Suspense>
  )
}
