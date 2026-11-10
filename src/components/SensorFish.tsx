import type { CSSProperties } from 'react'
import { SENSOR_MAX, SENSOR_MIN } from '../product'

type Props = {
  value?: number
  power: boolean
}

type FishStyle = CSSProperties & { '--level': number }

export default function SensorFish({ value, power }: Props) {
  const level =
    value === undefined
      ? 0
      : Math.min(1, Math.max(0, (value - SENSOR_MIN) / (SENSOR_MAX - SENSOR_MIN)))
  const brightness = Math.round(level * 100)
  const label = power ? `금붕어 밝기 ${brightness}%` : '금붕어 조명 꺼짐'

  return (
    <section className="fish-stage" aria-label="금붕어 상태">
      <div
        className="fish"
        data-power={power ? 'on' : 'off'}
        role="img"
        aria-label={label}
        style={{ '--level': level } as FishStyle}
      >
        <img src={`${import.meta.env.BASE_URL}images/goldfish.webp`} alt="" />
      </div>
      <div className="sensor-value">
        <span className="t-value">{value === undefined ? '—' : value.toLocaleString('ko-KR')}</span>
        <span className="t-caption">센서값</span>
      </div>
    </section>
  )
}
