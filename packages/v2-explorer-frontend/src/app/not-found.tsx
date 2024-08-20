import React from 'react'
import { NotFound } from './components/NotFound'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Not Found'
}

export default function ErrorPage () {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFound />
    </Suspense>
  )
}
