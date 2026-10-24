import registry from "./registry/2026-09-08.json"

// Never edit a released registry. Add a new registry for a future approved release.
export const CURRENT_LEGAL_RELEASE = registry
export const CURRENT_LEGAL_VERSIONS = registry.versions
export const LEGAL_ACCEPTANCE_TEXT = registry.legalText
export const HEALTH_CONSENT_TEXT = registry.healthText
export interface ConsentVersions {
  terms: string
  privacy: string
  health: string
  legalText: string
}
