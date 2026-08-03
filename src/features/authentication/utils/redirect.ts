const DEFAULT_REDIRECT = "/dashboard"

export function getSafeRedirectPath(
  requestedPath: string | null | undefined,
  fallback = DEFAULT_REDIRECT,
) {
  if (
    !requestedPath ||
    !requestedPath.startsWith("/") ||
    requestedPath.startsWith("//") ||
    requestedPath.includes("\\")
  ) {
    return fallback
  }

  return requestedPath
}

