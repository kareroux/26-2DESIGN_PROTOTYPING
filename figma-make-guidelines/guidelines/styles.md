# styles/globals.css 에 넣을 내용

아래 블록을 globals.css 맨 위에 그대로 넣는다. 메인 컬러, 폰트 슬롯은 여기서만 바꾼다.

파일 위치:
- 폰트: Google Fonts에서 불러온다 (IBM Plex Sans KR, 고운바탕). 로컬 woff2 파일은 쓰지 않는다
- 금붕어 이미지 `public/images/goldfish.webp` (800×800, 투명 배경)

```css
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600&family=Gowun+Batang:wght@400;700&display=swap");

:root {
  /* 학생 슬롯: 메인 컬러 (오렌지) */
  --brand: #ff8a3d;
  --on-brand: #241000;
  /* 학생 슬롯: 폰트 (메인, 서브) */
  --font-sans: "IBM Plex Sans KR", -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  --font-display: "Gowun Batang", "IBM Plex Sans KR", -apple-system, serif;

  --surface: #0a1a2f;
  --ink: #eef2f8;
  --ink-muted: #94a6c0;
  --line: #1e3350;
  --off: #4a5d7d;
  --fish-glow: #ffb066;
  --status-on: #4cc38a;
  --danger: #f97066;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px;
  color-scheme: dark;
}

body { margin: 0; background: var(--surface); color: var(--ink); font-family: var(--font-sans); }
:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
button { border: 0; border-radius: 0; }

/* 타입: 자간, 행간 지정 없음 */
.t-display { font-family: var(--font-display); font-size: 40px; font-weight: 700; }
.t-value   { font-family: var(--font-display); font-size: 48px; font-weight: 700; font-variant-numeric: tabular-nums; }
.t-body    { font-size: 16px; font-weight: 400; }
.t-label   { font-size: 14px; font-weight: 500; }
.t-caption { font-size: 12px; font-weight: 400; }
@media (max-width: 767px) { .t-display { font-size: 24px; } }

/* 센서 금붕어 */
.fish { --level: 0; width: min(72vw, 360px); aspect-ratio: 1; margin: 0 auto; animation: fish-float 6s ease-in-out infinite alternate; }
.fish img { display: block; width: 100%; height: 100%; object-fit: contain;
  filter: brightness(calc(0.25 + 0.75 * var(--level))) drop-shadow(0 0 calc(var(--level) * 48px) var(--fish-glow));
  transition: filter .4s; }
.fish[data-power="off"] img { filter: brightness(0.12) grayscale(1); }
@keyframes fish-float { from { transform: translateY(0); } to { transform: translateY(-10px); } }
@media (prefers-reduced-motion: reduce) { .fish { animation: none; } }
```
