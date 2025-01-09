'use client'
import React, { Suspense } from 'react'
import { useTheme } from '@/app/hooks/useTheme'
import Box from '@mui/material/Box'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

const bgImage = 'https://user-images.githubusercontent.com/168240/218269980-c26e1bb2-90d8-4816-b0cb-c8752e32cde1.svg'
const bgImageDark = 'https://user-images.githubusercontent.com/168240/218270008-16c5fe2a-33da-49c9-9fad-5286cbd6191d.svg'

export function SiteWrapper ({ children }: any) {
  const { theme, dark } = useTheme()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        style={{
          alignItems: 'stretch',
          backgroundImage: !dark ? `url(${bgImage})` : `url(${bgImageDark})`,
          // backgroundColor: theme?.palette?.background?.default,
          backgroundSize: '120%',
          transition: 'background 0.15s ease-out',
          minHeight: '100vh'
        }}>
        <Box p={4} m="0 auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Header />
          {children}
          <Footer />
        </Box>
      </div>
    </Suspense>
  )
}
