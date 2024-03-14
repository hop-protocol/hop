import dotenv from 'dotenv'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL ?? '/',
  server: {
    port: 3000,
  },

  plugins: [react(), svgr({
    svgrOptions: {
      icon: true,
    },
  })],

  define: {
    // "process.env.REACT_APP_NETWORK": process.env.REACT_APP_NETWORK ? `"${process.env.REACT_APP_NETWORK}"` : undefined
  },

  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
})
