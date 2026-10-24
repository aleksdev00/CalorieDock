"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"

import { LoginForm } from "@/features/authentication/components/LoginForm"
import { RegisterForm } from "@/features/authentication/components/RegisterForm"
import { LandingMotion } from "./LandingMotion"

type AccountMode = "login" | "register"

export function LandingAccountOverlay() {
  const [mode, setMode] = useState<AccountMode>("register")
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [switching, setSwitching] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const requestClose = useCallback(() => {
    if (!open || closing) return
    setClosing(true)
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 230)
  }, [closing, open])

  const switchMode = useCallback((nextMode: AccountMode) => {
    if (switching || nextMode === mode) return
    setSwitching(true)
    switchTimerRef.current = setTimeout(() => {
      setMode(nextMode)
      setSwitching(false)
    }, 190)
  }, [mode, switching])

  useEffect(() => {
    const handleTrigger = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const trigger = target?.closest<HTMLElement>("[data-account-mode]")
      if (!trigger) return
      event.preventDefault()
      lastTriggerRef.current = trigger
      setMode(trigger.dataset.accountMode === "login" ? "login" : "register")
      setOpen(true)
    }
    document.addEventListener("click", handleTrigger)
    return () => document.removeEventListener("click", handleTrigger)
  }, [])

  useEffect(() => {
    const toast = document.querySelector<HTMLElement>(".approved-toast")
    let timer: ReturnType<typeof setTimeout> | undefined
    const handleToast = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const source = target?.closest<HTMLElement>("[data-toast]")
      if (!source || !toast) return
      toast.textContent = source.dataset.toast ?? "Done"
      toast.classList.add("show")
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => toast.classList.remove("show"), 2800)
    }
    const toggle = document.querySelector<HTMLButtonElement>(".approved-menu-toggle")
    const mobileMenu = document.querySelector<HTMLElement>(".approved-mobile-menu")
    const handleMenu = () => {
      if (!toggle || !mobileMenu) return
      const open = toggle.getAttribute("aria-expanded") === "true"
      toggle.setAttribute("aria-expanded", String(!open))
      mobileMenu.hidden = open
    }
    document.addEventListener("click", handleToast)
    toggle?.addEventListener("click", handleMenu)
    return () => { document.removeEventListener("click", handleToast); toggle?.removeEventListener("click", handleMenu); if (timer) clearTimeout(timer) }
  }, [])

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ""
      lastTriggerRef.current?.focus()
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panelRef.current?.querySelector<HTMLElement>("input, button")?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { requestClose(); return }
      if (event.key !== "Tab" || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, [tabindex='0']"))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKeyDown) }
  }, [closing, open, requestClose])

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current)
  }, [])

  useEffect(() => {
    if (open && !switching) panelRef.current?.querySelector<HTMLElement>("input, button")?.focus()
  }, [open, switching, mode])

  return <>
    <LandingMotion />
    <nav className="approved-mobile-menu" aria-label="Mobile navigation" hidden>
      <a href="#product">Product</a><a href="#how-it-works">How it works</a><a href="#principles">Our approach</a><a href="#account" data-account-mode="login">Sign in</a>
    </nav>
    {open ? <div className={`approved-account-overlay${closing ? " is-closing" : ""}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) requestClose() }}>
    <div ref={panelRef} className={`approved-account-panel${closing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="account-panel-title">
      <button className="approved-account-close" type="button" aria-label="Close account panel" onClick={requestClose}>×</button>
      <Link className="approved-account-brand" href="/" onClick={() => setOpen(false)}><span className="approved-brand-mark">C</span>CalorieDock</Link>
      <div className={`approved-account-content${switching ? " is-switching" : ""}`}><div className="approved-account-heading"><h2 id="account-panel-title">{mode === "register" ? "Create your account" : "Welcome back"}</h2><p>{mode === "register" ? "Start with a focused record of meals, macros, water and weight." : "Sign in to continue to your daily record."}</p></div>
      {mode === "register" ? <RegisterForm onSwitch={() => switchMode("login")} /> : <LoginForm onSwitch={() => switchMode("register")} />}</div>
    </div>
    </div> : null}
  </>
}
