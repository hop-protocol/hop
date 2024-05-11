import { ChainSlug } from '../types.js'

// Return a type predicate
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

export function isValidChainSlug(slug: ChainSlug | string): slug is ChainSlug {
  return Object.values(ChainSlug).includes(slug as ChainSlug)
}
