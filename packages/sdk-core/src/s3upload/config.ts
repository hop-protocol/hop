import path from 'node:path'
import { loadEnvFile } from 'node:process'

const defaultEnvFilePath = path.resolve(process.cwd(), '.env')
if (defaultEnvFilePath) {
  loadEnvFile(defaultEnvFilePath)
}

export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const awsRegion = process.env.AWS_REGION
