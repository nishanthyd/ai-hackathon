/**
 * Application environment configuration & external app URLs.
 */

export const TRUST_CENTER_URL = (import.meta.env.VITE_TRUST_CENTER_URL || 'http://localhost:3000').replace(/\/+$/, '')

export function openTrustCenter(): void {
  window.open(TRUST_CENTER_URL, '_blank', 'noopener,noreferrer')
}
