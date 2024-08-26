import { Tokens } from './Tokens'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tokens',
}

export default async function DetailsPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tokens />
    </Suspense>
  )
}
