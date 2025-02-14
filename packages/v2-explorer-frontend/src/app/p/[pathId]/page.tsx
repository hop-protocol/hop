import { headers } from 'next/headers'
import { Details } from './Details'
import { fetchPathDetails } from '@/app/hooks/fetchPathDetails'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Path Details',
}

export default async function DetailsPage({ params }: { params: { pathId: string } }) {
  const pathId = params.pathId

  const pathDetails = await fetchPathDetails({
    pathId
  })

  return (
    <Suspense fallback={<LoadingText />}>
      <Details initialPathDetails={pathDetails} />
    </Suspense>
  )
}
