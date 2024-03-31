import './App.css'
import Box from '@mui/material/Box'
import React from 'react'
import bgImage from './assets/circles-bg.svg'
import styled from 'styled-components'
import { Details } from './pages/Details'
import { Events } from './pages/Events'
import { Main } from './pages/Main'
import { NotFound } from './pages/NotFound'
import { Route, Routes } from 'react-router-dom'

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
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/m/:id" element={<Details />} />
        <Route path="/events" element={<Events />} />
        <Route element={<NotFound />} />
      </Routes>
    </AppWrapper>
  )
}

export default App
