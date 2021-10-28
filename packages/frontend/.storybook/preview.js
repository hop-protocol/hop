import React from 'react'
import ThemeProvider from 'src/theme/ThemeProvider'
import Web3Context from 'src/contexts/Web3Context'
import AppContext from 'src/contexts/AppContext'
import { MemoryRouter } from 'react-router'
import 'src/App.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  Story => (
    <MemoryRouter initialEntries={['/']}>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <ThemeProvider>
        <Web3Context>
          <AppContext>
            <Story />
          </AppContext>
        </Web3Context>
      </ThemeProvider>
    </MemoryRouter>
  ),
]
