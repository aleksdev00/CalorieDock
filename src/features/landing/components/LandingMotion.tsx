"use client"

import { useEffect } from "react"

export function LandingMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".approved-site")
    if (!root) return

    const revealTargets = root.querySelectorAll<HTMLElement>(
      ".approved-section-intro, .approved-feature-large, .approved-feature-stack article, .approved-steps article, .approved-state-frame, .approved-entry-card, .approved-principles > .approved-section > div, .approved-closing > div",
    )
    revealTargets.forEach((element, index) => {
      element.classList.add("motion-reveal")
      element.style.setProperty("--motion-delay", `${Math.min(index * 55, 220)}ms`)
    })

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    root.classList.add("motion-ready")

    const observer = prefersReducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add("is-visible")
              observer?.unobserve(entry.target)
            })
          },
          { threshold: 0.14, rootMargin: "0px 0px -8%" },
        )
    revealTargets.forEach((element) => observer?.observe(element))

    const story = root.querySelector<HTMLElement>(".approved-dock-story")
    let frame = 0
    const update = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        root.dataset.scrolled = window.scrollY > 8 ? "true" : "false"
        if (story && !prefersReducedMotion) {
          const travel = Math.max(1, story.offsetHeight - window.innerHeight)
          const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - story.getBoundingClientRect().top) / travel))
          story.style.setProperty("--story-progress", progress.toFixed(3))
          story.classList.toggle("is-docked", progress > 0.72)
        }
        frame = 0
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    const dockAction = root.querySelector<HTMLButtonElement>(".approved-dock-action")
    const handleDock = () => {
      if (!dockAction) return
      const docked = dockAction.dataset.demoState !== "docked"
      dockAction.dataset.demoState = docked ? "docked" : "empty"
      dockAction.innerHTML = docked ? "Meal added to lunch <span>✓</span>" : "Add chicken rice bowl <span>+</span>"
      const target = root.querySelector<HTMLElement>(".approved-dock-target")
      const total = target?.querySelector<HTMLElement>(":scope > strong")
      const lunch = target?.querySelectorAll<HTMLElement>(".approved-dock-meal strong")[1]
      if (total) total.textContent = docked ? "1,847" : "1,237"
      if (lunch) lunch.textContent = docked ? "610 kcal" : "—"
      root.querySelectorAll<HTMLElement>(".approved-dock-macros strong").forEach((element, index) => {
        element.textContent = (docked ? ["142 g", "196 g", "61 g"] : ["98 g", "126 g", "38 g"])[index]
      })
    }
    dockAction?.addEventListener("click", handleDock)

    return () => {
      observer?.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      window.cancelAnimationFrame(frame)
      dockAction?.removeEventListener("click", handleDock)
    }
  }, [])

  return null
}
