import { describe, expect, it } from 'vitest'
import { extractDomain } from './domainExtractor'

describe('extractDomain', () => {
  it('strips www', () => {
    expect(extractDomain('https://www.youtube.com/watch?v=abc')).toBe('youtube.com')
  })

  it('handles plain domain', () => {
    expect(extractDomain('https://notion.so/page')).toBe('notion.so')
  })

  it('returns null on invalid url', () => {
    expect(extractDomain('not a url')).toBeNull()
  })
})
