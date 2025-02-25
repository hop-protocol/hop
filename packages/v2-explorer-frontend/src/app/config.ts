import { capitalize } from '@/app/utils'

// export const apiUrl = 'https://v2-explorer-api-sepolia.hop.exchange'
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
export const appApiHost = process.env.NEXT_PUBLIC_APP_API_HOST || 'localhost:3000'
export const networkSlug = process.env.NEXT_PUBLIC_NETWORK || 'sepolia'

export const networkName = capitalize(networkSlug)
