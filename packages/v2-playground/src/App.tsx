import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Main } from './pages/Main.js'
import { NotFound } from './pages/NotFound.js'
// import { Tutorial } from './pages/Tutorial.js'
// import { HardhatTutorial } from './pages/HardhatTutorial.js'
import bgImage from './assets/circles-bg.svg'
import { Web3Modal } from './components/Web3Modal/index.js'
import { ThemeProvider } from './contexts/ThemeContext.js'
import { useTheme } from './contexts/ThemeContext.js'

// Background wrapper component to access theme context
const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = useTheme();
  
  return (
    <Box sx={(theme) => ({
      alignItems: 'stretch',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '120%',
      backgroundBlendMode: darkMode ? 'soft-light' : 'normal',
      backgroundColor: theme.palette.background.default,
      backgroundOpacity: darkMode ? 0.5 : 1,
      transition: theme.transitions.create(['background-color', 'background-blend-mode'], {
        duration: theme.transitions.duration.standard
      }),
      minHeight: '100vh'
    })}>
      {children}
    </Box>
  );
};

function App () {
  return (
    <ThemeProvider>
      <BackgroundWrapper>
        <Switch>
          <Route path="/" exact component={Main} />
          {/*
          <Route path="/tutorial" component={Tutorial} />
          <Route path="/hardhat-tutorial" component={HardhatTutorial} />
          */}
          <Route component={NotFound} />
        </Switch>
        <Web3Modal />
      </BackgroundWrapper>
    </ThemeProvider>
  )
}

export default App
