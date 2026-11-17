# 어항 Design System v1.0

인터랙티브 오브제 조명 **어항**과 그 제품 웹사이트를 위한 디자인시스템.

| | |
|---|---|
| 제품 | 어항 — 손의 움직임에 반응하는 인터랙티브 오브제 조명 |
| 참고 사이트 | landonorris.com (구조·위계), t-able.org (절제 규칙) |
| 토큰 원본 | `tokens.json` |
| 적용 대상 | 제품 소개 웹사이트, 스크롤 조립 씬, 센서 대시보드 |

---

## 1. 브랜드 원칙

### 1.1 빛이 유일한 색이다
배경은 검정, 글자는 따뜻한 흰색, 그리고 색은 **하나뿐이다 — 호박색 `#FFA850`**.
이 값은 임의로 고른 색이 아니라 램프 3D 씬의 실제 광원 값(`lampLight 0xFFA850`)이고,
본문 흰색 `#F5F2EC`는 키 라이트 값(`0xFFF3E0`)에서 파생됐다.
화면의 색과 실물의 빛이 같은 숫자를 쓴다.

### 1.2 호박색은 장식이 아니라 신호다
호박색은 **상태가 켜져 있을 때만** 쓴다 — 활성, 선택, 포커스, 점등, 센서 반응.
한 화면에서 호박색 면적은 **5%를 넘지 않는다**. 넘으면 신호가 아니라 배경이 된다.
t-able.org가 순수 빨강 하나를 도장처럼만 쓰는 방식을 그대로 가져왔다.

### 1.3 수치는 숨기지 않는다
치수, 좌표, 센서값, 진행률은 **mono 서체로 그대로 노출한다**.
제품이 실측 3D 모델(188.5 × 90.8 × 242.0 mm)에서 나왔기 때문에,
숫자를 보여주는 것이 이 제품의 설득력이다.

### 1.4 움직임은 물리를 따른다
부품은 튕기지 않는다. 미끄러져 제자리에 들어간다.
조립 모션은 `easing/physical`, UI 모션은 `easing/standard`를 쓴다.

### 1.5 비어 있음은 실패가 아니다
여백은 채워야 할 공간이 아니다. 검은 바탕이 곧 조명의 무대다.

---

## 2. 토큰

### 2.1 색상 토큰

**원시 토큰 (primitive)** — 값 그 자체. 컴포넌트에서 직접 쓰지 않는다.

| 토큰 | 값 | 비고 |
|---|---|---|
| `ink-000` | `#000000` | 캔버스 |
| `ink-050` | `#0A0A0B` | 표면 |
| `ink-100` | `#141416` | 들린 표면 |
| `ink-400` | `#44464C` | 비활성 글자 |
| `ink-500` | `#7D808A` | 보조 글자 |
| `ink-700` | `#C7C9CE` | 본문 보조 |
| `ink-900` | `#F5F2EC` | 본문 |
| `amber-500` | `#FFA850` | **신호색**. 램프 점등값 |
| `amber-400` | `#FFC27A` | hover |
| `amber-600` | `#E08A33` | press |
| `warm-white` | `#FFF3E0` | 키 라이트 |
| `alert-500` | `#FF4A3D` | 오류 |
| `ok-500` | `#6FD08C` | 성공 |

**의미 토큰 (semantic)** — 컴포넌트는 반드시 이 층만 참조한다.

| 토큰 | 참조 | 용도 |
|---|---|---|
| `bg/canvas` | `ink-000` | 페이지 바탕 |
| `bg/surface` | `ink-050` | 카드·입력 필드 |
| `bg/raised` | `ink-100` | 모달·팝오버 |
| `bg/signal` | `amber-500` | Primary 버튼 바탕 |
| `fg/primary` | `ink-900` | 본문 |
| `fg/secondary` | `ink-700` | 설명문 |
| `fg/muted` | `ink-500` | 캡션·라벨 |
| `fg/on-signal` | `ink-000` | 호박색 위 글자 |
| `fg/signal` | `amber-500` | 링크·활성 라벨 |
| `border/hairline` | `rgba(245,242,236,0.12)` | 카드 경계 |
| `border/default` | `rgba(245,242,236,0.20)` | 입력 필드 |
| `border/signal` | `amber-500` | 포커스·선택 |
| `focus/ring` | `amber-500` | 키보드 포커스 |
| `glow/signal` | `rgba(255,168,80,0.45)` | 점등 효과 |

**명암비** — `fg/primary` on `bg/canvas` = 18.8:1. `fg/secondary` = 12.7:1. `fg/muted` = 5.3:1 (표면 위 5.0:1).
`fg/on-signal` on `bg/signal` = 11.0:1. 본문 등급 모두 WCAG AA 이상.
`fg/signal`(호박색 글자)은 **16px 이상에서만** 쓴다.

### 2.2 타이포그래피 토큰

| 역할 | 서체 | 용도 |
|---|---|---|
| display | Archivo | 큰 제목 |
| text | IBM Plex Sans KR | 본문·한글 |
| mono | IBM Plex Mono | 라벨·수치·HUD |

서체 두께는 **400 / 500 / 700 세 가지만** 쓴다.
t-able.org가 두 가지로 사이트 전체를 운용한 절제를 기준으로 삼았다.

**크기 스케일** — 11 · 12 · 14 · 16 · 20 · 24 · 32 · 48 · 64 · 96 px

**자간** — 큰 제목일수록 좁힌다. display `-0.03em`, heading `-0.015em`, 본문 `0`, mono 라벨 `+0.12em`.
landonorris.com의 음수 자간 처리를 그대로 가져온 규칙이다.

**텍스트 스타일**

| 스타일 | 서체 / 크기 / 두께 / 행간 |
|---|---|
| `display/xl` | Archivo 96 / 700 / 1.05 |
| `display/lg` | Archivo 64 / 700 / 1.05 |
| `heading/xl` | Archivo 48 / 700 / 1.25 |
| `heading/lg` | Archivo 32 / 500 / 1.25 |
| `heading/md` | Plex Sans KR 24 / 500 / 1.25 |
| `body/lg` | Plex Sans KR 20 / 400 / 1.55 |
| `body/md` | Plex Sans KR 16 / 400 / 1.55 |
| `body/sm` | Plex Sans KR 14 / 400 / 1.75 |
| `label/md` | Plex Mono 12 / 500 / 대문자 / +0.12em |
| `label/sm` | Plex Mono 11 / 500 / 대문자 / +0.12em |
| `data/md` | Plex Mono 16 / 400 — 치수·센서값 |

한글은 `display` 서체를 쓰지 않는다. 한글 제목은 `heading/md` 이하로 Plex Sans KR을 쓴다.

### 2.3 간격 · 반경 토큰

**간격** — 4px 배수. `0 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`
중간값을 만들지 않는다. 22px가 필요하면 설계가 틀린 것이다.

**반경** — `0 · 2 · 4 · 8 · 12 · 999`
알루미늄 프로파일과 3D 프린트 부품이 제품이므로 반경은 작게 유지한다.
`999`(pill)는 태그와 상태 뱃지에만 쓴다.

**선 두께** — hairline `1px`, thick `2px` 두 가지.

### 2.4 브레이크포인트 · 그리드

| 이름 | 최소폭 | 컬럼 | 거터 | 바깥 여백 |
|---|---|---|---|---|
| sm | 480px | 4 | 16px | 16px |
| md | 768px | 8 | 24px | 32px |
| lg | 1024px | 12 | 24px | 48px |
| xl | 1440px | 12 | 32px | 64px |

최대 콘텐츠 폭 `1440px`. 그 이상에서는 가운데 정렬하고 바깥을 비운다.

### 2.5 모션 규칙

| 토큰 | 값 | 용도 |
|---|---|---|
| `duration/instant` | 80ms | 눌림 피드백 |
| `duration/fast` | 160ms | hover, 색 변화 |
| `duration/base` | 240ms | 일반 전환 |
| `duration/slow` | 480ms | 패널·모달 |
| `duration/scene` | 900ms | 스크롤 조립 씬 |

| 토큰 | 값 | 용도 |
|---|---|---|
| `easing/standard` | `cubic-bezier(0.2,0,0,1)` | 기본 |
| `easing/enter` | `cubic-bezier(0,0,0,1)` | 등장 |
| `easing/exit` | `cubic-bezier(0.4,0,1,1)` | 퇴장 |
| `easing/physical` | `cubic-bezier(0.33,1,0.68,1)` | 부품 조립 |

**규칙**
- 색과 투명도는 애니메이션한다. 레이아웃 속성(width, top)은 하지 않는다.
- 한 화면에서 동시에 움직이는 요소는 **3개 이하**.
- `prefers-reduced-motion`에서는 transform 애니메이션을 모두 제거하고 opacity만 남긴다.
- 스크롤 씬은 스크롤 위치에 **직접 연동**한다. 스크롤과 무관한 자동 재생은 쓰지 않는다.

---

## 3. 컴포넌트

### 3.1 버튼

공통: 반경 `4px`, 서체 `label/md`(mono 대문자), 아이콘 간격 `8px`,
포커스 링 `2px solid amber-500`, offset `2px`.

| 크기 | 높이 | 좌우 패딩 |
|---|---|---|
| sm | 32px | 12px |
| md | 40px | 16px |
| lg | 48px | 24px |

**Primary** — 화면당 **하나만**. 주된 행동 하나에만 쓴다.

| 상태 | 바탕 | 글자 | 테두리 |
|---|---|---|---|
| default | `amber-500` | `ink-000` | 없음 |
| hover | `amber-400` | `ink-000` | 없음 |
| pressed | `amber-600` | `ink-000` | 없음 |
| disabled | `ink-200` | `fg/disabled` | 없음 |
| loading | `amber-600` | `ink-000` | mono 점 3개 애니메이션 |

**Secondary** — 대등한 선택지. 한 화면에 여럿 가능.

| 상태 | 바탕 | 글자 | 테두리 |
|---|---|---|---|
| default | 투명 | `fg/primary` | `border/default` |
| hover | `rgba(245,242,236,0.06)` | `fg/primary` | `border/strong` |
| pressed | `rgba(245,242,236,0.12)` | `fg/primary` | `border/strong` |
| disabled | 투명 | `fg/disabled` | `border/hairline` |

**Utility** — 보조 행동. 아이콘 단독 또는 짧은 글자.

| 상태 | 바탕 | 글자 |
|---|---|---|
| default | 투명 | `fg/muted` |
| hover | 투명 | `fg/primary` |
| pressed | 투명 | `fg/signal` |
| disabled | 투명 | `fg/disabled` |

**variant 축**: `type`(primary·secondary·utility) × `size`(sm·md·lg) ×
`state`(default·hover·pressed·disabled·loading) × `icon`(none·leading·trailing·only)

### 3.2 입력 필드 · 텍스트 영역

높이 `44px`, 패딩 `12px / 16px`, 반경 `4px`,
바탕 `bg/surface`, 테두리 `border/default`, 서체 `body/md`.
라벨은 필드 위 `8px`, 서체 `label/sm`.
텍스트 영역은 최소 높이 `120px`, 세로 리사이즈만 허용.

| 상태 | 테두리 | 그 외 |
|---|---|---|
| default | `border/default` | — |
| hover | `border/strong` | — |
| focus | `border/signal` 2px | 포커스 링 없음 (테두리가 대신함) |
| filled | `border/default` | 글자 `fg/primary` |
| error | `border/error` | 아래 `alert-500` 메시지, `body/sm` |
| disabled | `border/hairline` | 바탕 `ink-000`, 글자 `fg/disabled` |

도움말은 필드 아래 `8px`, `fg/muted`, `body/sm`.
오류 메시지는 **무엇이 틀렸는지가 아니라 어떻게 고치는지**를 쓴다.

**variant 축**: `type`(text·textarea) × `state`(6종) × `label`(있음·없음) × `help`(있음·없음)

### 3.3 프로젝트 카드

| 항목 | 값 |
|---|---|
| 바탕 | `bg/surface` |
| 테두리 | `border/hairline` 1px |
| 반경 | `8px` |
| 패딩 | `24px` |
| 내부 간격 | `16px` |
| 이미지 비율 | `4 : 3` |
| hover | 테두리 `border/signal`, `glow` 그림자, 160ms |

**구조 (위에서 아래로)**
1. 이미지 — 4:3, 반경 `4px`
2. 라벨 — `label/sm`, `fg/muted` (예: `PRODUCT · 2026`)
3. 제목 — `heading/md`, `fg/primary`
4. 설명 — `body/sm`, `fg/secondary`, 최대 3줄
5. 메타 — `data/md`, `fg/muted` (치수·소재)

**variant 축**: `size`(sm·md·lg) × `media`(image·none) × `state`(default·hover·focus) ×
`emphasis`(default·featured — featured는 테두리를 `border/signal`로 고정)

### 3.4 레이아웃 그리드 · 섹션 규칙

- 모든 콘텐츠는 그리드 컬럼에 정렬한다. 임의 위치를 쓰지 않는다.
- 섹션 세로 패딩: sm `64px`, md `96px`, lg `128px`
- 섹션 머리말(라벨 + 제목 + 설명) 내부 간격 `24px`
- 본문 글줄은 **12컬럼 중 8컬럼을 넘지 않는다**
- 한 섹션에 Primary 버튼은 하나
- 전체 폭 이미지는 그리드를 벗어나도 되지만, 그 위의 글자는 그리드를 지킨다

**표준 섹션 구조**

```
[label/sm · fg/muted]        ← 섹션 번호 또는 분류
[heading/xl · fg/primary]    ← 제목
[body/lg · fg/secondary]     ← 1~2문장
[간격 48px]
[콘텐츠: 카드 그리드 / 이미지 / 3D 씬]
```

---

## 4. 사용 가이드 · 정책

### 4.1 반드시 지킬 것
- 컴포넌트는 **의미 토큰만** 참조한다. 원시 토큰을 직접 쓰지 않는다.
- 토큰에 없는 색·간격·반경을 새로 만들지 않는다. 필요하면 토큰을 먼저 고친다.
- 호박색은 상태가 켜졌을 때만. 화면당 면적 5% 이하.
- 모든 상호작용 요소는 키보드 포커스가 보여야 한다.
- 터치 대상은 최소 `44 × 44px`.

### 4.2 하지 말 것
- 그라데이션 배경. 빛은 3D 씬에서만 난다.
- 두 번째 강조색 추가.
- 호박색을 큰 면적의 바탕으로 사용.
- 한글 제목에 display 서체 적용.
- 색만으로 상태를 전달 (아이콘이나 글자를 함께 쓴다).
- 토큰을 거치지 않은 하드코딩 값.

### 4.3 토큰 변경 절차
1. `tokens.json`을 고친다 (단일 원본)
2. 영향을 받는 컴포넌트를 표시한다
3. 명암비를 다시 확인한다
4. 버전을 올린다 — 색·간격 값 변경은 minor, 토큰 이름 변경·삭제는 major

### 4.4 접근성 기준
- 본문 명암비 4.5:1 이상, 큰 글자 3:1 이상
- 포커스 링은 제거하지 않는다
- `prefers-reduced-motion` 지원 필수
- 3D 씬에는 대체 텍스트 설명을 둔다

---

## 5. 적용 현황

| 화면 | 적용 | 비고 |
|---|---|---|
| 스크롤 조립 씬 | **적용 완료** | HUD 전체가 토큰 참조. 신호색이 램프 광원값과 동일 |
| 센서 대시보드 | 미적용 | v1.1에서 토큰 연결 예정 |
| 제품 소개 페이지 | 설계 완료 | 본 문서 기준 |

이 문서는 **시스템 정의**이고, 모든 컴포넌트가 현재 사이트에 구현되어 있지는 않다.
버튼·입력 필드·카드는 제품 소개 페이지 확장을 위해 미리 정의한 것이다.
