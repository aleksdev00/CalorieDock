"use client"

import { useEffect } from "react"

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)"

function getDelay(element: HTMLElement) {
  const value = getComputedStyle(element).getPropertyValue("--landing-delay")
  return Number.parseFloat(value) || 0
}

function animateReveal(element: HTMLElement) {
  const composition = element.hasAttribute("data-landing-composition")
  const animations: Animation[] = []

  animations.push(element.animate(
    [
      { opacity: 0, transform: composition ? "translateY(18px) scale(0.99)" : "translateY(18px)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ],
    { duration: 650, delay: getDelay(element), easing: EASE_OUT, fill: "both" },
  ))

  element.querySelectorAll<HTMLElement>("[data-landing-stagger]").forEach((child) => {
    animations.push(child.animate(
      [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 420, delay: getDelay(child), easing: EASE_OUT, fill: "both" },
    ))
  })

  element.querySelectorAll<HTMLElement>(".landing-step-line").forEach((line) => {
    animations.push(line.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: 420,
      delay: getDelay(element),
      easing: EASE_OUT,
      fill: "both",
    }))
  })

  if (composition) {
    element.querySelectorAll<HTMLElement>(".landing-dashboard-groups > *").forEach((group, index) => {
      animations.push(group.animate(
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 500, delay: 150 + index * 45, easing: EASE_OUT, fill: "both" },
      ))
    })
  }

  return animations
}

export function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-landing-reveal]"))
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      return
    }

    const animations: Animation[] = []

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const element = entry.target as HTMLElement
        animations.push(...animateReveal(element))
        observer.unobserve(element)
      })
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 })

    elements.forEach((element) => observer.observe(element))

    const disableMotion = (event: MediaQueryListEvent) => {
      if (!event.matches) return
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
    motionPreference.addEventListener("change", disableMotion)

    return () => {
      observer.disconnect()
      motionPreference.removeEventListener("change", disableMotion)
      animations.forEach((animation) => animation.cancel())
    }
  }, [])
}
