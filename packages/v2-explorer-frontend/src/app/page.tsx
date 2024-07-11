import Image from "next/image";
import { ExplorerEvents } from './components/TransferEvents'
import { fetchEvents } from './hooks/fetchEvents'

export default async function IndexPage() {
  const events = await fetchEvents({
    eventName: 'explorer'
  })

  return (
    <ExplorerEvents initialEvents={events} />
  )
}
