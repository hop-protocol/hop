import { headers } from 'next/headers'
import { Details } from './Details'
import { fetchEventDetails } from '@/app/hooks/fetchEventDetails'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Transfer Details',
}

export default async function DetailsPage({ params }: { params: { transferId: string } }) {
    const transferId = params.transferId

  const eventDetails = await fetchEventDetails({
    transferId
  })

  return (
    <Suspense fallback={<LoadingText />}>
      <Details initialEventDetails={eventDetails} />
    </Suspense>
  )
}
