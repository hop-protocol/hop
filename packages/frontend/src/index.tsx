import React, { ComponentType } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ThemeProvider from './theme/ThemeProvider'
import Web3Context from './contexts/Web3Context'
import AppContext from './contexts/AppContext'

const isIPFS = !!process.env.REACT_APP_IPFS_BUILD
const Router: ComponentType = isIPFS ? HashRouter : BrowserRouter

ReactDOM.render(
  <ThemeProvider>
    <Router>
      <Web3Context>
        <AppContext>
          <App />
        </AppContext>
      </Web3Context>
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
