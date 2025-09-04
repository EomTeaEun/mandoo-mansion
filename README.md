# 🥟 만두 맨션 게임 🏠

FastAPI와 React로 만든 웹 게임 프로젝트입니다.

## 📁 프로젝트 구조

```
mandoo-mansion/
├── backend/          # FastAPI 백엔드
│   ├── venv/        # Python 가상환경
│   ├── main.py      # 메인 서버 파일
│   └── requirements.txt
├── frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── App.jsx  # 메인 컴포넌트
│   │   └── App.css  # 스타일
│   └── package.json
└── images/           # 게임 이미지 파일들
```

## 🚀 실행 방법

### 1. 백엔드 실행 (FastAPI)

**첫 번째 터미널을 열고:**

```bash
# 백엔드 폴더로 이동
cd mandoo-mansion/backend

# 가상환경 활성화
source venv/bin/activate  # macOS/Linux
# 또는 Windows의 경우: venv\Scripts\activate

# 서버 실행
python main.py
```

백엔드 서버가 `http://127.0.0.1:8000`에서 실행됩니다.

### 2. 프론트엔드 실행 (React)

**두 번째 터미널을 열고:**

```bash
# 프론트엔드 폴더로 이동
cd mandoo-mansion/frontend

# 개발 서버 실행
npm run dev
```

프론트엔드가 `http://localhost:3000`에서 실행됩니다.

## 🌐 접속 방법

1. **백엔드 API**: http://127.0.0.1:8000
2. **프론트엔드**: http://localhost:3000
3. **API 문서**: http://127.0.0.1:8000/docs

## 🎮 게임 이미지들

프로젝트에는 다음과 같은 게임 이미지들이 포함되어 있습니다:

- 🏠 **장소**: 시작 화면, 침실, 부엌, 거실, 복도, 지하실, 화장실
- 🥟 **아이템**: 만두, 굴비
- 👤 **캐릭터**: 정면, 뒷면, 좌측, 우측
- 🎯 **결과**: 탈출, 해피엔딩, 배드엔딩

## 🔧 기술 스택

- **백엔드**: FastAPI, Python 3.9+
- **프론트엔드**: React 18, Vite
- **이미지 서빙**: FastAPI StaticFiles
- **CORS**: React 프론트엔드와의 통신 허용

## 📝 주의사항

1. **백엔드를 먼저 실행**해야 프론트엔드에서 이미지가 정상적으로 표시됩니다.
2. 두 서버가 모두 실행 중이어야 정상 작동합니다.
3. 가상환경이 활성화되어 있는지 확인하세요.

## 🆘 문제 해결

- **이미지가 안 보이는 경우**: 백엔드 서버가 실행 중인지 확인
- **CORS 오류**: 백엔드의 CORS 설정 확인
- **포트 충돌**: 8000번과 3000번 포트가 사용 가능한지 확인
# mandoo-mansion
