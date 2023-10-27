import { networks } from 'src/config'
import { ChainFinalityTag } from '@hop-protocol/core/config/types'

export const getFinalityTags = (slug: string): ChainFinalityTag => {
  const finalityTags = networks?.[slug]?.finalityTags
  if (!finalityTags) {
    throw new Error(`finalityTags not found for chain ${slug}`)
  }
  return finalityTags
}
