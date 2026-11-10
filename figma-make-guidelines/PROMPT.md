guidelines/Guidelines.md를 끝까지 읽고 그대로 따라서 IoT 조명 웹앱의 기본 프레임을 만들어줘.

- "styles/globals.css 에 넣을 내용"의 CSS 블록을 styles/globals.css 맨 위에 넣어줘.
- Setup 섹션의 파일 구조대로 src/product.ts, src/lib/supabase.ts, src/lib/device.ts, 컴포넌트 5개(SensorFish 대신 SensorFish), App.tsx를 만들어줘.
- 바탕은 짙은 파란색(--surface), 화면 정가운데에 public/images/goldfish.webp 금붕어를 띄우고 센서값에 따라 밝아지게 해줘.
- Supabase URL이 아직 자리표시라서 데모 모드(가상 센서값)로 동작하게 해줘.
- PRODUCT 값은 Guidelines.md의 제품 슬롯에 적힌 어항 값으로 채워줘.
- 스마트폰(375px)과 웹(1280px) 둘 다 반응형으로.
- 시각 규칙 8개를 특히 지켜줘: 카드 없음, 사각 요소에 테두리와 라운드 없음, 텍스트는 바탕 위에(버튼 제외), 섹션 소제목 없음, 중점(·) 없음, letter-spacing과 line-height 지정 없음, 구분선 그림자 그라데이션 이모지 없음.
- 폰트는 Google Fonts에서 메인 IBM Plex Sans KR(400, 500, 600), 서브 고운바탕 Gowun Batang(700). 서브는 제품 이름과 센서값 숫자에만.
- shadcn 컴포넌트는 쓰지 마.
