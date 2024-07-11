import React from 'react'
import { NotFound } from './components/NotFound'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found'
}

export default function ErrorPage () {
  return <NotFound />
}
