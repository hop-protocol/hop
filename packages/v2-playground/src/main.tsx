import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.js'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { CustomThemeProvider } from './theme/index.js'
import Web3Provider, { connectors } from './contexts/Web3Context.js'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Web3ReactProvider } from '@web3-react/core'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20000,
      cacheTime: 1000 * 60 * 60,
      // By default, retries in React Query do not happen immediately after a request fails.
      // As is standard, a back-off delay is gradually applied to each retry attempt.
      // The default retryDelay is set to double (starting at 1000ms) with each attempt, but not exceed 30 seconds:
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (err: any) => {
        console.error('react-query error:', err)
      },
    },
  },
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <CustomThemeProvider>
    <Web3ReactProvider connectors={connectors}>
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Web3Provider>
    </Web3ReactProvider>
  </CustomThemeProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
