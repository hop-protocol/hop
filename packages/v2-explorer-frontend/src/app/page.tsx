import Image from "next/image";
import { Main } from './pages/Main'
import { fetchEvents } from './hooks/fetchEvents'

export default async function IndexPage() {
  const events = await fetchEvents({
    eventName: 'explorer'
  })
  return (
    <Main initialEvents={events} />
  )
}
