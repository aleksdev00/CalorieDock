"use client"

import { useEffect } from "react"

import { useReveal } from "../hooks/use-reveal"

export function LandingMotion() {
  useReveal()

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-landing-header]")
    if (!header) return

    let frame = 0
    const update = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        header.dataset.scrolled = window.scrollY > 8 ? "true" : "false"
        frame = 0
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
