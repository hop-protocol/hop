import { ContractStates } from './ContractStates'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Contract States',
}

export default async function ContractStatesPage() {

  return (
    <Suspense fallback={<LoadingText />}>
      <ContractStates />
    </Suspense>
  )
}
