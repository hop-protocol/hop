import { headers } from "next/headers";
import { Details } from '../../pages/Details'
import { fetchEventDetails } from '../../hooks/fetchEventDetails'

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
