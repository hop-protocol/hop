"use client";
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider as CustomThemeProvider } from '@/app/hooks/useTheme'
import { SiteWrapper } from './SiteWrapper'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex: number) => 10 * 1000,
    },
  }
})

export function Providers({ children, initialTheme  }: any) {
  return (
    <CustomThemeProvider initialTheme={initialTheme}>
      <QueryClientProvider client={queryClient}>
        <SiteWrapper>
          {children}
        </SiteWrapper>
      </QueryClientProvider>
    </CustomThemeProvider>
  )
}
