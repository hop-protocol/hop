import './App.css'
import React from 'react'
import { Details } from './pages/Details.js'
// import { MessageDetails } from './pages/MessageDetails.js'
import { Events } from './pages/Events.js'
import { Main } from './pages/Main.js'
import { NotFound } from './pages/NotFound.js'
import { Route, Routes } from 'react-router-dom'
import { useTheme } from './useTheme.js'

const bgImage = 'https://user-images.githubusercontent.com/168240/218269980-c26e1bb2-90d8-4816-b0cb-c8752e32cde1.svg'
const bgImageDark = 'https://user-images.githubusercontent.com/168240/218270008-16c5fe2a-33da-49c9-9fad-5286cbd6191d.svg'

function App () {
  const { theme, dark } = useTheme()

  return (
      <div
      style={{
        alignItems: 'stretch',
        backgroundImage: !dark ? `url(${bgImage})` : `url(${bgImageDark})`,
        backgroundColor: theme?.palette?.background?.default,
        backgroundSize: '120%',
        transition: 'background 0.15s ease-out',
        minHeight: '100vh'
      }}>
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/m/:id" element={<MessageDetails />} /> */}
        <Route path="/t/:id" element={<Details />} />
        <Route path="/events" element={<Events />} />
        <Route element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
