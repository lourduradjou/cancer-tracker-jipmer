'use client'

import clsx from 'clsx'
import { useState, useEffect } from 'react'

/* Hook to track window width for breakpoints */
function useBreakpoint() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

export function SwipeableColumns({
  columns,
  activeIndex,
  setActiveIndex,
}: {
  columns: React.ReactNode[]
  activeIndex: number
  setActiveIndex: (i: number) => void
}) {
  const width = useBreakpoint()

  const isMobile = width < 1280// < lg
  const isDesktop = width >= 1280 // ≥ xl

  let content
  let dots: number[] = []

  if (isMobile) {
    // Mobile: one column at a time
    content = columns[activeIndex]
    dots = columns.map((_, i) => i)
  } else if (isDesktop) {
    // Desktop: show all
    content = (
      <div className="grid grid-cols-5 gap-2">
        {columns}
      </div>
    )
  }

  return (
    <section className="flex flex-col items-center w-full">
      <div className={clsx("w-full mt-4")}>{content}</div>

      {/* Only show dots on mobile + tablet */}
      {(isMobile) && (
        <div className="mt-4 flex justify-center gap-2">
          {dots.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-3 w-3 rounded-full transition-colors ${
                i === activeIndex ? 'bg-blue-600' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
