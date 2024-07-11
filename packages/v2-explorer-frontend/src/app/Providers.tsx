"use client";
import App from './App'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider as CustomThemeProvider } from './theme/useTheme'
import { SiteWrapper } from './SiteWrapper'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex: number) => 10 * 1000,
    },
  }
})

export function Providers({ children }: any) {
  return (
    <CustomThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SiteWrapper>
          {children}
        </SiteWrapper>
      </QueryClientProvider>
    </CustomThemeProvider>
  )
}
