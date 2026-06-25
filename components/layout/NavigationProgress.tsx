"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname } from "next/navigation"

function isInternalNavLink(anchor: HTMLAnchorElement, pathname: string): boolean {
  const href = anchor.getAttribute("href")
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false
  }
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false
  if (href.startsWith("http") && !href.startsWith(window.location.origin)) return false

  const path = href.split("?")[0].split("#")[0]
  return path !== pathname
}

export function NavigationProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const startProgress = useCallback(() => {
    clearTimers()
    setVisible(true)
    setProgress(18)
    timersRef.current.push(setTimeout(() => setProgress(55), 120))
    timersRef.current.push(setTimeout(() => setProgress(78), 350))
    timersRef.current.push(setTimeout(() => setProgress(92), 700))
  }, [clearTimers])

  const finishProgress = useCallback(() => {
    clearTimers()
    setProgress(100)
    timersRef.current.push(
      setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 220)
    )
  }, [clearTimers])

  useEffect(() => {
    finishProgress()
    return clearTimers
  }, [pathname, finishProgress, clearTimers])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a")
      if (!anchor || !isInternalNavLink(anchor, pathname)) return
      startProgress()
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [pathname, startProgress])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none"
      role="progressbar"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gold shadow-[0_0_8px_rgba(201,169,98,0.45)] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
