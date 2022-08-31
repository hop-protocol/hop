import React, { ComponentType } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ThemeProvider from './theme/ThemeProvider'
import Web3Provider from './contexts/Web3Context'
import AppProvider from './contexts/AppContext'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { ReactQueryDevtools } from 'react-query/devtools'

const isIPFS = !!process.env.REACT_APP_IPFS_BUILD
const Router: ComponentType = isIPFS ? HashRouter : BrowserRouter

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20000,
      cacheTime: 1000 * 60 * 60,
      // By default, retries in React Query do not happen immediately after a request fails.
      // As is standard, a back-off delay is gradually applied to each retry attempt.
      // The default retryDelay is set to double (starting at 1000ms) with each attempt, but not exceed 30 seconds:
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: err => {
        console.log(`react-query error:`, err)
      },
    },
  },
})

ReactDOM.render(
  <SafeProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Web3Provider>
            <AppProvider>
              <App />
              <ReactQueryDevtools />
            </AppProvider>
          </Web3Provider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  </SafeProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
