import { useEffect, useRef, useState } from 'react'

export function useThrottledValue<T>(value: T, delay = 400): T {
    const [throttledValue, setThrottledValue] = useState(value)
    const lastRanRef = useRef(0)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const latestValueRef = useRef(value)

    useEffect(() => {
        latestValueRef.current = value

        const now = Date.now()
        const elapsed = now - lastRanRef.current

        if (lastRanRef.current === 0 || elapsed >= delay) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }

            lastRanRef.current = now
            setThrottledValue(value)
            return
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            lastRanRef.current = Date.now()
            setThrottledValue(latestValueRef.current)
            timeoutRef.current = null
        }, delay - elapsed)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }, [value, delay])

    return throttledValue
}