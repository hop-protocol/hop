import App from '#App.js'
import AppProvider from '#contexts/AppContext/index.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import ThemeProvider from '#theme/ThemeProvider.js'
import Web3Provider, { connectors } from '#contexts/Web3Context.js'
// import reportWebVitals from '#reportWebVitals.js'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Web3ReactProvider } from '@web3-react/core'

const Router: typeof HashRouter = HashRouter

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20_000,
      cacheTime: 60 * 60 * 1000, // 1 hour in milliseconds
      retry: 10,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),
      refetchOnWindowFocus: false,
      onError: (err: unknown) => {
        console.error('React Query error:', err)
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <SafeProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Web3ReactProvider connectors={connectors}>
            <Web3Provider>
              <AppProvider>
                <App />
                {import.meta?.env?.DEV && <ReactQueryDevtools />}
              </AppProvider>
            </Web3Provider>
          </Web3ReactProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  </SafeProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
