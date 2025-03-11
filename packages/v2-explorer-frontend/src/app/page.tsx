import { ExplorerEvents } from './components/ExplorerEvents'
import { fetchEvents } from './hooks/fetchEvents'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export default async function Page({
  searchParams
}: {
  searchParams: { page?: string, limit?: string }
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10
  
  const events = await fetchEvents({
    eventName: 'explorer',
    page,
    limit
  })

  return (
    <Suspense fallback={<LoadingText />}>
      <ExplorerEvents initialEvents={events} />
    </Suspense>
  )
}
