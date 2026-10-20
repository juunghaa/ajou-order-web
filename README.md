# AjouOrder - 아주대 캠퍼스 카페 주문 앱

> **현재 상태 (2026-10-17)**: 사후 점검에서 주문·결제·관리자 권한 문제가 확인되어 **주문·결제·관리자 기능은 의도적으로 중지**했습니다. 중지 중에도 카페·메뉴 조회, 로그인, AI 메뉴 추천, 로그인 사용자의 본인 주문 내역은 사용할 수 있습니다.
> 발견한 문제, 적용한 조치, 남은 한계는 [docs/REVIEW.md](docs/REVIEW.md)에 정리했습니다.

아주대학교 캠퍼스 카페의 모바일 주문 흐름을 구현한 **웹 프로젝트**입니다. 현재 주문·결제 기능은 사후 점검에 따라 중지했습니다.
카페·메뉴 탐색과 AI 메뉴 추천을 제공하며, 주문 상태 확인은 이전 구현의 점검 대상입니다. 메뉴와 가격은 서버가 Supabase `menus`에서 읽은 값만 표시하며, 메뉴 API가 실패하면 오류를 표시합니다.

## 🔗 프로젝트 링크

| 구분             | 설명             | 주소                                                                                             |
| -------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| Web Client     | React 기반 프론트엔드 | [https://github.com/juunghaa/ajou-order-web](https://github.com/juunghaa/ajou-order-web)       |
| Server API     | 주문/메뉴 REST API | [https://github.com/juunghaa/ajou-order-server](https://github.com/juunghaa/ajou-order-server) |
| Live Demo (FE) | 실제 서비스 화면      | [https://ajou-order-web.vercel.app](https://ajou-order-web.vercel.app)                         |
| Live API (BE)  | 배포된 백엔드 서버     | [https://ajou-order-server.onrender.com](https://ajou-order-server.onrender.com)               |

> Render 특성상 백엔드 서버는 첫 요청 시 지연(Cold Start)이 발생할 수 있습니다.

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── common/          # 공통 UI 컴포넌트
│   │   ├── Header.jsx   # 헤더 (뒤로가기, 장바구니)
│   │   ├── Button.jsx   # 버튼 컴포넌트
│   │   ├── Modal.jsx    # 모달 컴포넌트
│   │   └── Loading.jsx  # 로딩, 스켈레톤 UI
│   ├── menu/            # 메뉴 관련 컴포넌트
│   │   ├── MenuCard.jsx
│   │   ├── MenuList.jsx
│   │   └── MenuDetail.jsx
│   └── cart/            # 장바구니 관련
│       ├── CartItem.jsx
│       └── CartSummary.jsx
├── pages/               # 페이지 단위 컴포넌트
│   ├── HomePage.jsx
│   ├── MenuPage.jsx
│   ├── CartPage.jsx
│   ├── OrderPage.jsx
│   └── OrderCompletePage.jsx
├── context/
│   └── CartContext.jsx  # 장바구니 전역 상태 관리
├── lib/
│   └── supabase.js      # Supabase 클라이언트 설정
├── App.jsx              # 라우팅 설정
├── index.js             # 엔트리 포인트
└── index.css            # 글로벌 스타일
```

---

## 🚀 설치 및 실행

### 1. 필수 패키지 설치

```bash
npm install
```

### 2. Supabase 설정

현재 `src/lib/supabase.js`에 Supabase URL과 anon 키가 직접 들어 있습니다. anon 키는 브라우저에 공개되는 키이므로 데이터 접근 제어는 Supabase RLS 정책이 담당합니다(점검 내용은 [docs/REVIEW.md](docs/REVIEW.md) 참고). 본인 Supabase 프로젝트로 실행하려면 이 파일의 값을 교체하세요. 환경변수(`.env`) 방식으로의 전환은 아직 하지 않았습니다.

### 3. 실행

```bash
npm start
```

---

## 🎨 디자인 시스템

### 컬러 팔레트

* **Primary (Ajou Blue)**: `#0E4A84`
* **Secondary**: `#1565C0`
* **Light**: `#E3F2FD`
* **Dark**: `#0D3A6B`
* **Accent**: `#FF6B35`

### 공통 컴포넌트 클래스

* `.btn-primary` - 기본 버튼
* `.btn-secondary` - 보조 버튼
* `.btn-ghost` - 고스트 버튼
* `.card` - 카드 UI
* `.input-field` - 입력 필드
* `.badge-primary` - 프라이머리 뱃지
* `.badge-accent` - 액센트 뱃지

---

## 📱 주요 기능

1. **카페 선택** - 캠퍼스 내 카페 목록 및 영업 상태 표시
2. **메뉴 조회** - 카테고리/검색 기반 메뉴 탐색
3. **옵션 선택** - 온도, 사이즈, 추가 옵션 선택
4. **장바구니** - 수량 조절, 삭제, 카페 변경 시 초기화 확인
5. **주문 및 결제** - 결제 수단 선택 및 주문 처리 *(현재 중지: 점검 중)*
6. **주문 완료 화면** - 주문 번호 및 상태 확인 *(현재 중지: 점검 중)*

---

## ⚡ 고급 기능 (Advanced Features)

### 💳 토스페이먼츠 결제 연동 (테스트 모드, 현재 중지)

* 토스페이먼츠 SDK로 **결제창 호출 → 성공/실패 페이지 이동**까지 구현했습니다(테스트 키 사용).
* **서버 측 결제 승인과 금액 검증은 구현되어 있지 않습니다.** 그래서 실제 서비스에서 쓸 수 있는 결제 흐름으로 보지 않고 결제 기능을 중지했습니다.
* 토스 외 결제 수단은 실제 결제 없이 주문만 생성하는 시뮬레이션이었습니다.

### 🤖 AI 메뉴 추천 (Groq LLM)

* **Groq API (`openai/gpt-oss-20b`)** 기반 AI 바리스타 기능
* 카페별 실제 메뉴 데이터 기반 추천
* 자연어 질의 지원 (예: "달달한 음료 추천해줘")
* 가격과 메뉴명을 포함한 구체적인 추천 응답
* **AI 추천 API**: `POST /api/ai/recommend`

### 🔄 Supabase Realtime

* 홈 화면의 카페 영업 상태가 Supabase Realtime(WebSocket)으로 갱신됩니다.
* 관리자 화면의 주문·카페 목록 갱신에도 사용했으나, 관리자 화면은 현재 중지 상태입니다.
* 사용자 화면의 주문 상태 실시간 반영은 구현하지 않았습니다.

---

## 🔧 TODO (고도화 계획)

* [ ] 주문 이력 기반 개인화 추천 고도화
* [ ] 푸시 알림 (픽업 준비 알림)
* [ ] 포인트 / 쿠폰 시스템
* [ ] 관리자 매출 통계 대시보드
* [ ] PWA 전환 (앱처럼 설치)
* [ ] 다국어 지원 (영어/중국어)

---

## 📦 사용 기술

### Frontend

* React 19
* React Router DOM
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database / Auth

* Supabase (PostgreSQL)
* Supabase Auth

### Payment

* 토스페이먼츠 SDK

### AI

* Groq API (`openai/gpt-oss-20b`)

### Deployment

* Vercel (Frontend)
* Render (Backend)
