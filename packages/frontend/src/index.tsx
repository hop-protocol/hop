import React, { ComponentType } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ThemeProvider from './theme/ThemeProvider'
import Web3Provider from './contexts/Web3Context'
import AppProvider from './contexts/AppContext'

const isIPFS = !!process.env.REACT_APP_IPFS_BUILD
const Router: ComponentType = isIPFS ? HashRouter : BrowserRouter

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15000,
      cacheTime: 1000 * 60 * 60,
    },
  },
})

ReactDOM.render(
  <ThemeProvider>
    <Router>
      <Web3Provider>
        <AppProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AppProvider>
      </Web3Provider>
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
