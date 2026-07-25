'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const brickWidth = 192
const brickHeight = 96
const brickGap = 4

function Brick({
  column,
  row,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof motion.rect>, 'x' | 'y'> & {
  column: number
  row: number
}) {
  let rowOffset = Math.abs(row % 2) === 1 ? -brickWidth / 2 : 0

  return (
    <motion.rect
      x={brickGap}
      y={brickGap}
      width={brickWidth - brickGap * 2}
      height={brickHeight - brickGap * 2}
      rx={brickGap}
      transform={`translate(${brickWidth * column + rowOffset} ${brickHeight * row})`}
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
    [1, 1],
    [-2, 3],
    [2, 5],
    [-3, 2],
    [3, 7],
    [-1, 9],
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
      y = Math.floor(y / brickHeight)

      let rowOffset = Math.abs(y % 2) === 1 ? -brickWidth / 2 : 0
      x = Math.floor((x - rowOffset) / brickWidth)

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
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, times: [0, 0, 1] }}
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
          width={brickWidth * 2}
          height={brickHeight * 2}
          x="50%"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(0 ${yOffset})`}
          fill="none"
        >
          <path
            d={`M0 0H${brickWidth * 2}M0 ${brickHeight}H${brickWidth * 2}M0 ${brickHeight * 2}H${brickWidth * 2}M0 0V${brickHeight}M${brickWidth} 0V${brickHeight}M${brickWidth * 2} 0V${brickHeight}M${brickWidth / 2} ${brickHeight}V${brickHeight * 2}M${brickWidth * 1.5} ${brickHeight}V${brickHeight * 2}`}
          />
        </pattern>
      </defs>
    </svg>
  )
}
