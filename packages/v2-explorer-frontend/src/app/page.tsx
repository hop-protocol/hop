import { ExplorerEvents } from './components/TransferEvents'
import { fetchEvents } from './hooks/fetchEvents'
import { Suspense } from 'react'

export default async function IndexPage() {
  const events = await fetchEvents({
    eventName: 'explorer'
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExplorerEvents initialEvents={events} />
    </Suspense>
  )
}
