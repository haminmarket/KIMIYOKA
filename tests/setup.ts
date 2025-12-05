/**
 * Vitest global setup file
 * Runs before all tests
 */

// Mock chrome APIs for testing
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
    },
  },
} as any

// Mock fetch for API tests
global.fetch = vi.fn()

// Setup cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})
