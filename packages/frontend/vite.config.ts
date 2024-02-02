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

  define: {
    "process.env.REACT_APP_NETWORK": process.env.REACT_APP_NETWORK ? `"${process.env.REACT_APP_NETWORK}"` : undefined,
    "process.env.REACT_APP_WARNING_ROUTES": process.env.REACT_APP_WARNING_ROUTES ? `"${process.env.REACT_APP_WARNING_ROUTES}"` : undefined,
    "process.env.REACT_APP_DISABLED_ROUTES": process.env.REACT_APP_DISABLED_ROUTES ? `"${process.env.REACT_APP_DISABLED_ROUTES}"` : undefined,
    "process.env.REACT_APP_DISABLED_ROUTES_NO_LIQUIDITY_WARNING_MESSAGE": process.env.REACT_APP_DISABLED_ROUTES_NO_LIQUIDITY_WARNING_MESSAGE ? `"${process.env.REACT_APP_DISABLED_ROUTES_NO_LIQUIDITY_WARNING_MESSAGE}"` : undefined,
    "process.env.REACT_APP_BLOCKLIST_ENABLED": process.env.REACT_APP_BLOCKLIST_ENABLED ? `"${process.env.REACT_APP_BLOCKLIST_ENABLED}"` : undefined,
    "process.env.REACT_APP_ENABLED_TOKENS": process.env.REACT_APP_ENABLED_TOKENS ? `"${process.env.REACT_APP_ENABLED_TOKENS}"` : undefined,
    "process.env.REACT_APP_DEPRECATED_TOKENS": process.env.REACT_APP_DEPRECATED_TOKENS ? `"${process.env.REACT_APP_DEPRECATED_TOKENS}"` : undefined,
    "process.env.REACT_APP_ENABLED_CHAINS": process.env.REACT_APP_ENABLED_CHAINS ? `"${process.env.REACT_APP_ENABLED_CHAINS}"` : undefined,
    "process.env.REACT_APP_BNC_DAPP_ID": process.env.REACT_APP_BNC_DAPP_ID ? `"${process.env.REACT_APP_BNC_DAPP_ID}"` : undefined,
    "process.env.REACT_APP_SHOW_BANNER_MESSAGE": process.env.REACT_APP_SHOW_BANNER_MESSAGE ? `"${process.env.REACT_APP_SHOW_BANNER_MESSAGE}"` : undefined,
    "process.env.REACT_APP_GIT_SHA": process.env.REACT_APP_GIT_SHA ? `"${process.env.REACT_APP_GIT_SHA}"` : undefined,
    "process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS": process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS ? `"${process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS}"` : undefined,
  },

  plugins: [react(), svgr({
    svgrOptions: {
      icon: true,
    },
  })],

  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
})
