import Image from 'next/image'
import { Suspense } from 'react'
import { Events } from '@/app/components/AllEvents'
import { Metadata } from 'next'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'All Events',
}

export default async function Page() {
  return (
    <Suspense fallback={<LoadingText />}>
      <Events />
    </Suspense>
  )
}
