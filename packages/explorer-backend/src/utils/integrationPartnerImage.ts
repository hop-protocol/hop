import { integrationPartnerImageUrls } from '../config'

export function integrationPartnerImage (slug: string) {
  return integrationPartnerImageUrls[slug]
}
