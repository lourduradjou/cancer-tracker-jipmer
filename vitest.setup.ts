// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// ---- Polyfills for Radix/Shadcn (if needed) ----
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserver as any)
