import "server-only"

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { getPublicEnvironment } from "@/lib/env"
import type { Database } from "@/types/database"

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/daily-summary",
  "/foods",
  "/onboarding",
  "/meals",
  "/progress",
  "/water",
  "/weight",
  "/profile",
  "/settings",
]

const GUEST_ONLY_ROUTE_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
]

function matchesRoute(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

function redirectWithRefreshedCookies(url: URL, source: NextResponse) {
  const redirectResponse = NextResponse.redirect(url)

  source.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}

export async function refreshAuthSession(request: NextRequest) {
  const environment = getPublicEnvironment()
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTE_PREFIXES)
  const isGuestOnlyRoute = matchesRoute(pathname, GUEST_ONLY_ROUTE_PREFIXES)

  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.search = ""
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    )

    return redirectWithRefreshedCookies(loginUrl, response)
  }

  if (isProtectedRoute && user && !user.email_confirmed_at) {
    const verificationUrl = request.nextUrl.clone()
    verificationUrl.pathname = "/verify-email"
    verificationUrl.search = ""

    if (user.email) {
      verificationUrl.searchParams.set("email", user.email)
    }

    return redirectWithRefreshedCookies(verificationUrl, response)
  }

  let profileCompleted = false

  if (user?.email_confirmed_at && (isProtectedRoute || isGuestOnlyRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_completed")
      .eq("id", user.id)
      .maybeSingle()

    profileCompleted = profile?.profile_completed ?? false
  }

  if (
    isProtectedRoute &&
    user?.email_confirmed_at &&
    pathname !== "/onboarding" &&
    !profileCompleted
  ) {
    return redirectWithRefreshedCookies(
      new URL("/onboarding", request.url),
      response,
    )
  }

  if (
    pathname === "/onboarding" &&
    user?.email_confirmed_at &&
    profileCompleted
  ) {
    return redirectWithRefreshedCookies(
      new URL("/dashboard", request.url),
      response,
    )
  }

  if (isGuestOnlyRoute && user?.email_confirmed_at) {
    return redirectWithRefreshedCookies(
      new URL(profileCompleted ? "/dashboard" : "/onboarding", request.url),
      response,
    )
  }

  return response
}
