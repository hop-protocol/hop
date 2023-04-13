require('dotenv').config()

export const pinataApiKey = process.env.PINATA_API_KEY
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY
export const outdir = process.env.OUT_DIR
export const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID
export const cloudflareToken = process.env.CLOUDFLARE_TOKEN
