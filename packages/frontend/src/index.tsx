import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ThemeProvider from './theme/ThemeProvider'
import Web3Context from './contexts/Web3Context'
import AppContext from './contexts/AppContext'

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
