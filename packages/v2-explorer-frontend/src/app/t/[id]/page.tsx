import { headers } from 'next/headers'
import { Details } from './Details'
import { fetchEventDetails } from '@/app/hooks/fetchEventDetails'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transfer Details',
}

export default async function DetailsPage() {
  const heads = headers()
  const pathname = heads.get('x-current-path')
  const parts = pathname.split('/')
  const transferId = parts[2]

  const eventDetails = await fetchEventDetails({
    transferId
  })

  return (
    <Details initialEventDetails={eventDetails} />
  )
}
