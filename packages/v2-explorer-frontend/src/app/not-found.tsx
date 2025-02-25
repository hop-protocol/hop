import React from 'react'
import { NotFound } from './components/NotFound'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Not Found'
}

export default function ErrorPage () {
  return (
    <Suspense fallback={<LoadingText />}>
      <NotFound />
    </Suspense>
  )
}
