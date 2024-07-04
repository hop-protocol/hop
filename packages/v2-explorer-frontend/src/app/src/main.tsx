"use client";
import './index.css'
import App from './App'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider as CustomThemeProvider } from './useTheme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex: number) => 10 * 1000,
    },
  }
})

export function Main(props: any) {
  console.log('Props', props)
  return (
    <CustomThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </CustomThemeProvider>
  )
}
