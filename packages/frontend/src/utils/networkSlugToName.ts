import { metadata } from 'src/config'

export const networkSlugToName = (network: string) => {
  return metadata.networks?.[network]?.name
}
