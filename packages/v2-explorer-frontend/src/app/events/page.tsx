import Image from "next/image";
import { Events } from '../components/AllEvents'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Events',
}

export default async function Page() {
  return (
    <Events />
  )
}
