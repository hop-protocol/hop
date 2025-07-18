import { headers } from 'next/headers'
import { Details } from './Details'
import { fetchMessageDetails } from '@/app/hooks/fetchMessageDetails'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Message Details',
}

export default async function DetailsPage({ params }: { params: { messageId: string } }) {
  const messageId = params.messageId

  const messageDetails = await fetchMessageDetails({
    messageId
  })

  return (
    <Suspense fallback={<LoadingText />}>
      <Details initialMessageDetails={messageDetails} />
    </Suspense>
  )
}
