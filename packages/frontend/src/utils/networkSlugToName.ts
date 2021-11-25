import { metadata } from 'src/config'

const networkSlugToName = (network: string) => {
  return metadata.networks?.[network]?.name
}

export default networkSlugToName
