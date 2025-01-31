import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Main } from './pages/Main.js'
import { NotFound } from './pages/NotFound.js'
import { Tutorial } from './pages/Tutorial.js'
import { HardhatTutorial } from './pages/HardhatTutorial.js'
import bgImage from './assets/circles-bg.svg'
import { Web3Modal } from './components/Web3Modal/index.js'

function App () {
  return (
    <Box style={{
      alignItems: 'stretch',
      backgroundImage: `url(${bgImage})`,
      backgroundColor: 'rgb(253, 247, 249)',
      backgroundSize: '120%',
      transition: 'background 0.15s ease-out',
      minHeight: '100vh'
    }}>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/tutorial" component={Tutorial} />
        <Route path="/hardhat-tutorial" component={HardhatTutorial} />
        <Route component={NotFound} />
      </Switch>
      <Web3Modal />
    </Box>
  )
}

export default App
