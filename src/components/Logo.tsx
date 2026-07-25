import clsx from 'clsx'

type LogoProps = React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean
  filled?: boolean
  fillOnHover?: boolean
}

function BrandLogo({
  src,
  viewBox,
  className,
  invert = false,
  filled = false,
  fillOnHover = false,
  ...props
}: LogoProps & {
  src: string
  viewBox: string
}) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      className={clsx(fillOnHover && 'group/logo', className)}
      data-filled={filled || undefined}
      {...props}
    >
      <image
        href={src}
        width="2363"
        height="2363"
        className={clsx(
          invert && 'brightness-0 invert',
          fillOnHover &&
            'transition-opacity duration-300 group-hover/logo:opacity-75',
        )}
      />
    </svg>
  )
}

export function Logomark(props: LogoProps) {
  return (
    <BrandLogo
      src="/logos/small-logo.svg"
      viewBox="280 637 1802 1088"
      {...props}
    />
  )
}

export function Logo(props: LogoProps) {
  return (
    <BrandLogo
      src="/logos/full-logo.svg"
      viewBox="110 900 2143 545"
      {...props}
    />
  )
}
