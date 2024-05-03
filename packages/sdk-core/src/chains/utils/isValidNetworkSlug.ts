import { NetworkSlug } from '../types.js'

// Return a type predicate
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

export function isValidNetworkSlug(slug: any): slug is NetworkSlug {
  return Object.values(NetworkSlug).includes(slug)
}