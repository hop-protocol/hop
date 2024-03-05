import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Main } from './pages/Main'
import { NotFound } from './pages/NotFound'
import { Tutorial } from './pages/Tutorial'
import { HardhatTutorial } from './pages/HardhatTutorial'
import styled from 'styled-components'
import bgImage from './assets/circles-bg.svg'

const AppWrapper = styled(Box)<any>`
  align-items: stretch;
  background-image: url(${bgImage});
  background-color: rgb(253, 247, 249);
  background-size: 120%;
  transition: background 0.15s ease-out;
  min-height: 100vh;
`

function App () {
  return (
    <AppWrapper>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/tutorial" component={Tutorial} />
        <Route path="/hardhat-tutorial" component={HardhatTutorial} />
        <Route component={NotFound} />
      </Switch>
    </AppWrapper>
  )
}

export default App
