import { Paths } from './Paths'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Paths',
}

export default async function DetailsPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Paths />
    </Suspense>
  )
}
