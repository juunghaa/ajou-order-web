# AjouOrder - 아주대 캠퍼스 카페 주문 앱

아주대학교 캠퍼스 내 카페에서 모바일로 간편하게 주문하고 결제할 수 있는 **웹 기반 주문 서비스**입니다.
대기 시간을 줄이고, 실시간 주문 상태 확인과 AI 메뉴 추천을 통해 사용자 경험을 향상시키는 것을 목표로 합니다.

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
npm install react-router-dom @supabase/supabase-js tailwindcss postcss autoprefixer
```

### 2. Tailwind CSS 설정

```bash
npx tailwindcss init -p
```

`tailwind.config.js`를 프로젝트 설정에 맞게 수정합니다.

### 3. Supabase 설정

`src/lib/supabase.js` 파일 생성 후 본인 프로젝트 정보로 설정합니다.

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

`.env` 파일 예시:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 4. 실행

```bash
npm run dev
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
5. **주문 및 결제** - 결제 수단 선택 및 주문 처리
6. **주문 완료 화면** - 주문 번호 및 상태 확인

---

## ⚡ 고급 기능 (Advanced Features)

### 💳 토스페이먼츠 결제 연동

* 토스페이먼츠 SDK를 활용한 **실제 결제 플로우 구현 (테스트 모드)**
* 카드 결제, 토스페이, 카카오페이 등 다양한 결제 수단 지원
* 결제 성공/실패 콜백 처리
* 결제 실패 시 주문 데이터 복구 및 예외 처리

### 🤖 AI 메뉴 추천 (Groq LLM)

* **Groq API (Llama 3.1)** 기반 AI 바리스타 기능
* 카페별 실제 메뉴 데이터 기반 추천
* 자연어 질의 지원 (예: "달달한 음료 추천해줘")
* 가격과 메뉴명을 포함한 구체적인 추천 응답
* **AI 추천 API**: `POST /api/ai/recommend`

### 🔄 실시간 주문 상태 업데이트

* Supabase Realtime(WebSocket) 기반 실시간 동기화
* 관리자 주문 상태 변경 시 사용자 화면 즉시 반영
* 카페 영업 상태 실시간 업데이트

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

* React 18
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

* Groq API (Llama 3.1)

### Deployment

* Vercel (Frontend)
* Render (Backend)
