import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Main } from './pages/Main'
import { Details } from './pages/Details'
import { Events } from './pages/Events'
import { NotFound } from './pages/NotFound'
import './App.css'
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
