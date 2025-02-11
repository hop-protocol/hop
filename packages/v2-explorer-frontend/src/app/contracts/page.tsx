import { ContractsState } from './Contracts'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Contracts State',
}

export default async function ContractsStatePage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <ContractsState />
    </Suspense>
  )
}
