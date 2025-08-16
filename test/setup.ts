import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// ---- Common web API/polyfills used by Radix/Shadcn ----
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserver as any)

class IntersectionObserver {
    root: Element | Document | null = null
    rootMargin: string = ''
    thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return []
    }
}
vi.stubGlobal('IntersectionObserver', IntersectionObserver as any)

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }),
})

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
    value: vi.fn(),
    writable: true,
})

// optional: PointerEvent for userEvent.click on some components
class PointerEvent extends MouseEvent {
    constructor(type: string, params?: MouseEventInit) {
        super(type, params)
    }
}
vi.stubGlobal('PointerEvent', PointerEvent as any)
