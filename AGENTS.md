# Project Guidance

This project started from the Studio template by Tailwind Plus and is being updated into the marketing website for Arumi, a home services company.

## Product and Content

- Arumi is a home services company serving Mississippi.
- Content inherited from the Studio template is legacy placeholder content unless explicitly confirmed as Arumi content.
- Do not invent addresses, phone numbers, email addresses, service areas, business hours, testimonials, certifications, pricing, or social media URLs. Ask for missing business information.
- Remove or replace Studio agency language when touching a page. Arumi's primary services are electrical, plumbing, HVAC, and home services consulting.
- The public site and metadata use US English. Spell "Mississippi" correctly.

## Styling

- All headers must use the custom Tailwind CSS class `text-brand`.
- All other important or emphasized text, including titles and bold text, must also use `text-brand`.
- Use the existing `brand` and `brand-dark` Tailwind color tokens. Do not introduce duplicate hard-coded brand colors.
- On `bg-brand`, `bg-brand-dark`, or other dark surfaces, use `text-white` when necessary for readable contrast.
- Prefer existing shared components such as `Container`, `PageIntro`, `SectionIntro`, `Button`, `FadeIn`, and `RootLayout` before creating new layout primitives.
- Preserve responsive behavior and visible keyboard focus states.

## Feature Flags

- Feature flags are defined in `src/lib/featureFlags.ts` and use build-time `NEXT_PUBLIC_FEATURE_*` variables.
- Only the home route is enabled by default. A flag is enabled only when its value is exactly `true`.
- Office addresses and social media are independently controlled by `NEXT_PUBLIC_FEATURE_OFFICE_ADDRESS` and `NEXT_PUBLIC_FEATURE_SOCIAL_MEDIA`.
- When adding a public route, update the route map, `.env.example`, and relevant navigation surfaces.
- Do not expose links to disabled routes. Preserve the fail-closed behavior unless the task explicitly changes it.

## Application Architecture

- This is a Next.js 16 App Router application using React 19, strict TypeScript, Tailwind CSS 4, and MDX.
- Prefer server components. Add `'use client'` only when browser APIs, state, effects, or event handlers require it.
- Use the `@/` import alias for files under `src`.
- Use `next/image` and static imports for local raster images.

## Current Limitations

- The contact form is currently presentational and has no submission backend. Do not represent it as operational without implementing and verifying an integration.
- Blog posts, work pages, client logos, office details, and social links may still be Studio template placeholders.

## Verification

- Run `npm run lint` after code changes.
- Run `npm run build` for changes affecting routing, environment variables, MDX, or production rendering.
- There is currently no automated test suite. State what was manually verified.
