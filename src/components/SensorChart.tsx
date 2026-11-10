import { useEffect, useRef, useState } from 'react'
import type { Reading } from '../lib/device'
import { SENSOR_MAX } from '../product'

type Props = {
  readings: Reading[]
}

const height = 200
const padding = { left: 40, right: 8, top: 8, bottom: 20 }

export default function SensorChart({ readings }: Props) {
  const containerRef = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(320)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(1, Math.floor(entry.contentRect.width)))
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const chartWidth = Math.max(1, width - padding.left - padding.right)
  const chartHeight = height - padding.top - padding.bottom
  const points = readings
    .map((reading, index) => {
      const x =
        padding.left +
        (readings.length < 2 ? chartWidth : (index / (readings.length - 1)) * chartWidth)
      const normalized = Math.min(1, Math.max(0, reading.value / SENSOR_MAX))
      const y = padding.top + chartHeight - normalized * chartHeight
      return `${x},${y}`
    })
    .join(' ')
  const current = readings.at(-1)?.value
  const ticks = [0, SENSOR_MAX / 2, SENSOR_MAX]

  return (
    <section className="sensor-chart" aria-label="실시간 센서값" ref={containerRef}>
      {readings.length === 0 ? (
        <p className="t-body chart-empty">센서를 연결하면 값이 여기에 그려집니다.</p>
      ) : (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`센서값 추이, 현재 ${current}`}
        >
          {ticks.map((tick) => {
            const y = padding.top + chartHeight - (tick / SENSOR_MAX) * chartHeight
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y}
                  y2={y}
                  className="chart-grid"
                />
                <text x={padding.left - 8} y={y} className="chart-label" textAnchor="end">
                  {Math.round(tick).toLocaleString('ko-KR')}
                </text>
              </g>
            )
          })}
          <polyline points={points} className="chart-line" />
          <text x={padding.left} y={height - 4} className="chart-label">
            −60s
          </text>
          <text x={width - padding.right} y={height - 4} className="chart-label" textAnchor="end">
            지금
          </text>
        </svg>
      )}
    </section>
  )
}
