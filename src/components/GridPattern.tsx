'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function Brick({
  column,
  row,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof motion.rect>, 'x' | 'y'> & {
  column: number
  row: number
}) {
  let rowOffset = Math.abs(row % 2) === 1 ? -48 : 0

  return (
    <motion.rect
      x="2"
      y="2"
      width="92"
      height="44"
      rx="2"
      transform={`translate(${96 * column + rowOffset} ${48 * row})`}
      {...props}
    />
  )
}

export function GridPattern({
  yOffset = 0,
  interactive = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  yOffset?: number
  interactive?: boolean
}) {
  let id = useId()
  let ref = useRef<React.ElementRef<'svg'>>(null)
  let currentBlock = useRef<[x: number, y: number] | undefined>(undefined)
  let counter = useRef(0)
  let [hoveredBlocks, setHoveredBlocks] = useState<
    Array<[x: number, y: number, key: number]>
  >([])
  let staticBlocks = [
    [1, 2],
    [2, 6],
    [4, 9],
    [6, 4],
    [7, 13],
    [5, 17],
  ]

  useEffect(() => {
    if (!interactive) {
      return
    }

    function onMouseMove(event: MouseEvent) {
      if (!ref.current) {
        return
      }

      let rect = ref.current.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return
      }

      x = x - rect.width / 2
      y = y - yOffset
      y = Math.floor(y / 48)

      let rowOffset = Math.abs(y % 2) === 1 ? -48 : 0
      x = Math.floor((x - rowOffset) / 96)

      if (currentBlock.current?.[0] === x && currentBlock.current?.[1] === y) {
        return
      }

      currentBlock.current = [x, y]

      setHoveredBlocks((blocks) => {
        let key = counter.current++
        let block = [x, y, key] as (typeof hoveredBlocks)[number]
        return [...blocks, block].filter(
          (block) => !(block[0] === x && block[1] === y && block[2] !== key),
        )
      })
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [yOffset, interactive])

  return (
    <svg ref={ref} aria-hidden="true" {...props}>
      <rect width="100%" height="100%" fill={`url(#${id})`} strokeWidth="0" />
      <svg x="50%" y={yOffset} strokeWidth="0" className="overflow-visible">
        {staticBlocks.map((block) => (
          <Brick key={`${block}`} column={block[0]} row={block[1]} />
        ))}
        {hoveredBlocks.map((block) => (
          <Brick
            key={block[2]}
            column={block[0]}
            row={block[1]}
            className="fill-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0] }}
            transition={{
              duration: 1.5,
              times: [0, 0.12, 1],
              ease: 'easeOut',
            }}
            onAnimationComplete={() => {
              setHoveredBlocks((blocks) =>
                blocks.filter((b) => b[2] !== block[2]),
              )
            }}
          />
        ))}
      </svg>
      <defs>
        <pattern
          id={id}
          width="192"
          height="96"
          x="50%"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(0 ${yOffset})`}
          fill="none"
        >
          <path d="M0 0H192M0 48H192M0 96H192M0 0V48M96 0V48M192 0V48M48 48V96M144 48V96" />
        </pattern>
      </defs>
    </svg>
  )
}
