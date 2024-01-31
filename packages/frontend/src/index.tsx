import App from 'src/App'
import AppProvider from 'src/contexts/AppContext'
import React from 'react'
import ReactDOM from 'react-dom'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import ThemeProvider from 'src/theme/ThemeProvider'
import Web3Provider from 'src/contexts/Web3Context'
import reportWebVitals from 'src/reportWebVitals'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const Router: typeof HashRouter = HashRouter

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
