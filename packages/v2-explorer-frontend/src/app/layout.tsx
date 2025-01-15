import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './Providers'
import { LoadingText } from '@/app/components/LoadingText'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Hop v2 Explorer',
  description: 'Hop v2 Explorer'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read theme cookie from the server
  const themeCookie = cookies().get('theme')
  const initialTheme = themeCookie?.value || 'light'

  return (
    <html lang="en">
      <body>
        <Suspense fallback={<LoadingText />}>
          <Providers initialTheme={initialTheme}>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
