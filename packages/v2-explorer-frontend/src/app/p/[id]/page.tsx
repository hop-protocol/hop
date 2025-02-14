import { headers } from 'next/headers'
import { Details } from './Details'
import { fetchPathDetails } from '@/app/hooks/fetchPathDetails'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Path Details',
}

export default async function DetailsPage() {
  const heads = headers()
  const pathname = heads.get('x-current-path')
  const parts = pathname?.split('/')
  const pathId = parts?.[2]

  const pathDetails = await fetchPathDetails({
    pathId
  })

  return (
    <Suspense fallback={<LoadingText />}>
      <Details initialPathDetails={pathDetails} />
    </Suspense>
  )
}
