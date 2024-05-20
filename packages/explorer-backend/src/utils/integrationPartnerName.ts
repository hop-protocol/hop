import { integrationPartnerNames } from '../config'

export function integrationPartnerName (slug: string) {
  return integrationPartnerNames[slug]
}
