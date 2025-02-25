import { ExplorerEvents } from './components/ExplorerEvents'
import { fetchEvents } from './hooks/fetchEvents'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export default async function IndexPage() {
  const events = await fetchEvents({
    eventName: 'explorer'
  })

  return (
    <Suspense fallback={<LoadingText />}>
      <ExplorerEvents initialEvents={events} />
    </Suspense>
  )
}
