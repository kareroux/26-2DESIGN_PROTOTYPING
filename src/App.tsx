import { useState } from 'react'
import { rows, stages, years } from './data'

const palette = ['#242424', '#ff6846', '#1f8a70', '#7a68cc', '#d39817']
const groups = [
  { label: '지역', indices: [1, 2, 3, 5, 6] },
  { label: '주요 과목', indices: [8, 9, 10, 11, 12, 17, 18, 19] },
  { label: '사교육 유형', indices: [24, 25, 26, 27, 28, 30, 31, 32, 33] },
  { label: '학교 성적', indices: [44, 45, 46, 47, 48] },
  { label: '부모 교육', indices: [53, 54, 55, 56, 61, 62, 63, 64] },
  { label: '가구 소득', indices: [70, 75, 76, 77, 78, 80, 81, 83] },
]

const latest = (row: (typeof rows)[number], stage = 0) => row.values[9][stage]
const format = (value: number | null) => (value == null ? '—' : `${value.toFixed(1)}%`)

function LineChart({ rowIndex = 0, min = 45, max = 95, ticks = [50, 60, 70, 80, 90] }: {
  rowIndex?: number
  min?: number
  max?: number
  ticks?: number[]
}) {
  const data = rows[rowIndex]
  const width = 760
  const height = 250
  const left = 38
  const top = 14
  const chartW = 700
  const chartH = 190
  const y = (v: number) => top + chartH - ((v - min) / (max - min)) * chartH
  const x = (i: number) => left + (i / (years.length - 1)) * chartW

  return (
    <div className="chart-scroll">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" aria-label={`2016년부터 2025년까지 학교급별 ${data.name} 참여율 추이`}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={left} x2={left + chartW} y1={y(tick)} y2={y(tick)} className="gridline" />
            <text x={left - 8} y={y(tick) + 4} textAnchor="end" className="axis-label">{tick}</text>
          </g>
        ))}
        {data.values[0].map((_, stage) => {
          const pts = data.values.map((values, i) => `${x(i)},${y(values[stage] ?? min)}`).join(' ')
          return (
            <g key={stages[stage]}>
              <polyline points={pts} fill="none" stroke={palette[stage]} strokeWidth="2.5" strokeLinejoin="round" />
              {data.values.map((values, i) => (
                <circle key={i} cx={x(i)} cy={y(values[stage] ?? min)} r="3.2" fill={palette[stage]} />
              ))}
            </g>
          )
        })}
        {years.map((year, i) => <text key={year} x={x(i)} y={232} textAnchor="middle" className="axis-label">{year}</text>)}
      </svg>
    </div>
  )
}

function ComparisonBars({ indices }: { indices: number[] }) {
  const sorted = [...indices].sort((a, b) => (latest(rows[b]) ?? 0) - (latest(rows[a]) ?? 0))
  return (
    <div className="bar-list">
      {sorted.map((index) => {
        const value = latest(rows[index])
        const cleanName = rows[index].name.replace(/^[^:]+:\s*/, '')
        return (
          <div className="bar-row" key={index}>
            <div className="bar-meta"><span>{cleanName}</span><strong>{format(value)}</strong></div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${value ?? 0}%` }} /></div>
          </div>
        )
      })}
    </div>
  )
}

function App() {
  const [activeGroup, setActiveGroup] = useState(0)
  const overall = rows[0]
  const academic = rows[7]
  const change = (latest(overall) ?? 0) - (overall.values[0][0] ?? 0)
  const incomeGap = (latest(rows[83]) ?? 0) - (latest(rows[70]) ?? 0)

  return (
    <main>
      <header className="topbar">
        <div className="brand">DATA NOTE 25</div>
        <div className="source">통계청 · 2016—2025</div>
      </header>

      <section className="hero">
        <div className="eyebrow">PRIVATE EDUCATION PARTICIPATION</div>
        <div className="title">10년간의<br /><em>사교육 참여율</em></div>
        <p className="lede">학교급과 지역, 과목, 가정환경에 따라 달라지는 참여율을 84개 특성과 10개년 데이터로 살펴봅니다.</p>
        <div className="hero-stat">
          <span>2025 전체 참여율</span>
          <strong>75.7<small>%</small></strong>
          <div className="delta">2016년 대비 +{change.toFixed(1)}%p</div>
        </div>
      </section>

      <section className="section trend-section">
        <div className="section-head">
          <div><span className="number">01</span><div className="section-title">학교급별 10년 추이</div></div>
          <p>2020년의 급락 이후 빠르게 반등했습니다. 초등학교 참여율은 전 기간 가장 높은 수준을 유지합니다.</p>
        </div>
        <div className="legend">
          {stages.map((stage, i) => <span key={stage}><i style={{ background: palette[i] }} />{stage}</span>)}
        </div>
        <LineChart />
        <div className="stat-strip">
          {stages.map((stage, i) => (
            <div key={stage}><span>{stage}</span><strong>{format(latest(overall, i))}</strong><small>2025</small></div>
          ))}
        </div>
      </section>

      <section className="section academic-section">
        <div className="section-head">
          <div><span className="number">02</span><div className="section-title">예체능을 뺀 사교육 추이</div></div>
          <p>음악·미술·체육을 제외한 일반교과 사교육 참여율입니다. 중학교가 전 기간 가장 높고, 2025년에는 모든 학교급에서 하락했습니다.</p>
        </div>
        <div className="legend">
          {stages.map((stage, i) => <span key={stage}><i style={{ background: palette[i] }} />{stage}</span>)}
        </div>
        <LineChart rowIndex={7} min={35} max={75} ticks={[40, 50, 60, 70]} />
        <div className="stat-strip">
          {stages.map((stage, i) => (
            <div key={stage}><span>{stage}</span><strong>{format(latest(academic, i))}</strong><small>2025</small></div>
          ))}
        </div>
        <p className="definition-note">※ 통계표의 ‘일반교과 사교육’ 항목을 사용했습니다. 음악·미술·체육 등 예체능·취미·교양 사교육은 포함하지 않습니다.</p>
      </section>

      <section className="section explore-section">
        <div className="section-head">
          <div><span className="number">03</span><div className="section-title">특성별 비교</div></div>
          <p>아래 분류를 바꿔가며 2025년 전체 평균 참여율을 비교해 보세요.</p>
        </div>
        <div className="tabs">
          {groups.map((group, i) => (
            <div
              key={group.label}
              className={`tab ${activeGroup === i ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveGroup(i)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setActiveGroup(i) }}
            >{group.label}</div>
          ))}
        </div>
        <div className="comparison-grid">
          <div className="comparison-copy">
            <span className="kicker">2025 / 전체 평균</span>
            <div className="comparison-title">{groups[activeGroup].label}에 따른<br />참여율 차이</div>
            <p>막대가 길수록 해당 특성을 가진 학생의 사교육 참여 비율이 높습니다.</p>
          </div>
          <ComparisonBars indices={groups[activeGroup].indices} />
        </div>
      </section>

      <section className="section findings">
        <div className="section-head light">
          <div><span className="number">04</span><div className="section-title">데이터가 말하는 세 가지</div></div>
        </div>
        <div className="finding-grid">
          <article>
            <span>소득 격차</span>
            <strong>{incomeGap.toFixed(1)}<small>%p</small></strong>
            <p>월소득 1,000만원 이상 가구와 300만원 미만 가구의 참여율 차이</p>
          </article>
          <article>
            <span>지역 격차</span>
            <strong>{((latest(rows[2]) ?? 0) - (latest(rows[6]) ?? 0)).toFixed(1)}<small>%p</small></strong>
            <p>서울과 읍면지역 사이의 2025년 사교육 참여율 차이</p>
          </article>
          <article>
            <span>가장 큰 변화</span>
            <strong>−7.3<small>%p</small></strong>
            <p>2024년에서 2025년 사이 전체 참여율은 크게 낮아졌습니다</p>
          </article>
        </div>
      </section>

      <section className="section matrix-section">
        <div className="section-head">
          <div><span className="number">05</span><div className="section-title">과목 × 학교급</div></div>
          <p>2025년 주요 과목 참여율. 진할수록 참여율이 높습니다.</p>
        </div>
        <div className="matrix">
          <div className="matrix-row matrix-head"><span>과목</span>{stages.slice(1, 4).map((s) => <span key={s}>{s}</span>)}</div>
          {[8, 9, 10, 11, 12, 17, 18, 19].map((index) => (
            <div className="matrix-row" key={index}>
              <strong>{rows[index].name}</strong>
              {[1, 2, 3].map((stage) => {
                const value = latest(rows[index], stage) ?? 0
                return <span key={stage} className="heat" style={{ '--heat': value / 70 } as React.CSSProperties}>{format(value)}</span>
              })}
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div>자료: 통계청 「초중고사교육비조사」</div>
        <div>단위: % · ‘—’는 해당 값 없음</div>
      </footer>
    </main>
  )
}

export default App
