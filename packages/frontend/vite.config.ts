import { defineConfig } from 'vite'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // plugins: [react(), viteCommonjs()],

  optimizeDeps: {
    include: ['linked-dep', '@hop-protocol/core', '@hop-protocol/sdk', '@hop-protocol/core/networks', '@hop-protocol/core/metadata', '@hop-protocol/core/metadata/tokens', '@hop-protocol/core/contracts', '@hop-protocol/core/addresses', '@hop-protocol/core/config'],
  },
  // commonjsOptions: {
  //   esmExternals: true,
  // },
  // build: {
  //   commonjsOptions: {
  //     include: [/linked-dep/, /node_modules/],
  //   },
  // },

  // optimizeDeps: {
  //     exclude: ['@hop-protocol/core', '@hop-protocol/sdk'],
  // },

  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      // '@hop-protocol/core': path.resolve(__dirname, 'node_modules/@hop-protocol/core'),
      // '@hop-protocol/sdk': path.resolve(__dirname, 'node_modules/@hop-protocol/sdk/dist/index.js'),
      // '@hop-protocol/sdk': path.resolve(__dirname, 'node_modules/@hop-protocol/sdk/src/index.ts'),
      // '@hop-protocol/sdk/constants': path.resolve(__dirname, 'node_modules/@hop-protocol/sdk/src/constants/index.ts'),
      // 'hop-protocol/core/metadata/tokens': path.resolve(__dirname, 'node_modules/@hop-protocol/core/src/metadata/tokens/index.ts'),
      // 'hop-protocol/core/metadata': path.resolve(__dirname, 'node_modules/@hop-protocol/core/src/metadata/index.ts'),
      // 'hop-protocol/core/networks': path.resolve(__dirname, 'node_modules/@hop-protocol/core/src/networks/index.ts'),
      // 'hop-protocol/core/contracts': path.resolve(__dirname, 'node_modules/@hop-protocol/core/src/contracts/index.ts'),
      // 'hop-protocol/core/addresses': path.resolve(__dirname, 'node_modules/@hop-protocol/core/src/addresses/index.ts'),
      // 'hop-protocol/core/config': path.resolve(__dirname, 'node_modules/@hop-protocol/core/src/config/index.ts'),
      // 'hop-protocol/core/abi': path.resolve(__dirname, 'node_modules/@hop-protocol/core/src/abi/index.ts'),
    },
  },
})
