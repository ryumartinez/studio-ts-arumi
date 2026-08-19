const isEnabled = (value: string | undefined) => value === 'true'

/**
 * Build-time release flags for routes and optional site content.
 *
 * Flags default to off so unfinished routes cannot be released accidentally.
 * Because these values are also used to hide links in client components, they
 * use Next.js's NEXT_PUBLIC_ prefix and are set at build time.
 */
export const featureFlags = {
  home: true,
  about: isEnabled(process.env.NEXT_PUBLIC_FEATURE_ABOUT),
  blog: isEnabled(process.env.NEXT_PUBLIC_FEATURE_BLOG),
  contact: isEnabled(process.env.NEXT_PUBLIC_FEATURE_CONTACT),
  officeAddress: isEnabled(
    process.env.NEXT_PUBLIC_FEATURE_OFFICE_ADDRESS,
  ),
  process: isEnabled(process.env.NEXT_PUBLIC_FEATURE_PROCESS),
  socialMedia: isEnabled(process.env.NEXT_PUBLIC_FEATURE_SOCIAL_MEDIA),
  work: isEnabled(process.env.NEXT_PUBLIC_FEATURE_WORK),
} as const

export type FeatureFlag = keyof typeof featureFlags

const routeFlags = [
  { pathname: '/about', flag: 'about' },
  { pathname: '/blog', flag: 'blog' },
  { pathname: '/contact', flag: 'contact' },
  { pathname: '/process', flag: 'process' },
  { pathname: '/work', flag: 'work' },
] as const satisfies ReadonlyArray<{
  pathname: string
  flag: FeatureFlag
}>

export function isRouteEnabled(pathname: string) {
  if (pathname === '/') {
    return featureFlags.home
  }

  const route = routeFlags.find(
    ({ pathname: routePathname }) =>
      pathname === routePathname || pathname.startsWith(`${routePathname}/`),
  )

  // New routes stay private until they are explicitly added to the flag map.
  return route ? featureFlags[route.flag] : false
}
