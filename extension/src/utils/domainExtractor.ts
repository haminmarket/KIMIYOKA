/**
 * Extracts registrable domain (hostname) from a URL string.
 * Handles www/subdomains; leaves eTLD+1 logic simple for MVP.
 */
export function extractDomain(urlString: string): string | null {
  try {
    const url = new URL(urlString)
    // Strip common www.
    return url.hostname.replace(/^www\./, '')
  } catch (_err) {
    return null
  }
}
