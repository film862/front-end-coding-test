# 🧪 프론트엔드 코딩테스트 과제

## 🎯 과제 개요

사용자가 **도시명을 입력**하면, 해당 도시의 **향후 5일간 오전7시 날씨 예보를 카드 형태로 보여주는 웹 애플리케이션**을 구현하세요.

- 프레임워크: Next.js (React 기반)
- 스타일링: TailwindCSS 또는 MUI
- API 연동 및 에러 핸들링 포함

---

## ✅ 요구사항

### 📌 기능

- 도시명 입력 인풋 + 조회 버튼
- 입력한 도시의 날씨 정보 출력
- 날짜, 기온, 강수확률, 하늘상태(아이콘/텍스트) 포함
- 에러 발생 시 안내 메시지 출력

### 🎨 UI

- 카드 레이아웃 (반응형 고려)
- 하늘 상태에 따른 색/아이콘 구분 (예: 맑음 ☀️ / 흐림 ☁️)

---

## 🌐 사용할 외부 API

### 1. 📍 도시명 → 위경도 (Nominatim API)
- Endpoint:  
  `https://nominatim.openstreetmap.org/search?q={도시명}&format=json`
- 설명: 사용자가 입력한 도시명을 위도(lat)/경도(lon)로 변환
- 상세 api 명세서: https://nominatim.org/release-docs/latest/api/Search/
- **요청 인자**:
  | 인자명 | 의미 |
  |--------|------|
  | `q` | 도시 이름 (예: 서울) |
  | `format` | 반환 형식 (`json`) |
- **출력 인자**:
  | 인자명 | 의미 |
  |--------|------|
  | `lat` | 위도 |
  | `lon` | 경도 |
- **출력 예시**:
    ```json
    [
        {
            "place_id":206967182,
            "licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
            "osm_type":"relation",
            "osm_id":2297418,
            "lat":"37.5666791",
            "lon":"126.9782914",
            "class":"boundary",
            "type":"administrative",
            "place_rank":8,
            "importance":0.7656069953535114,
            "addresstype":"city",
            "name":"서울",
            "display_name":"서울, 대한민국",
            "boundingbox":[
                "37.4285424",
                "37.7014794",
                "126.7644328",
                "127.1837702"
            ]
        }
    ]
    ```

---

### 2. 🗺 위경도 → 격자 좌표 (기상청 API)
- 위경도를 단기 예보 기상청 API가 요구하는 격자(nx, ny)로 변환
- Endpoint:  
  [GET] `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?pageNo=1&numOfRows=1000&dataType=JSON&base_date=20250522&base_time=0500&nx=55&ny=127&authKey=R_zkyTnBQfy85Mk5wWH8Ow`
- **요청 파라미터**:
  | 인자명 | 의미 |
  |--------|------|
  | `lon` | 경도 |
  | `lat` | 위도 |
  | `authKey` | 2rvTFXzSTpi70xV80l6YMg |
- **출력 인자**:
  | 인자명 | 의미 |
  |--------|------|
  | `lat` | 격자 위도 |
  | `lon` | 격자 경도 |
  | `x` | 동네예보 격자 번호(동서방향) |
  | `y` | 동네예보 격자 번호(남북방향) |
- **응답 예시**: JSON 형식이 아니고 일반 텍스트 응답이므로 파싱 작업 필요
    ```
    #START7777
    #       LON,         LAT,   X,   Y
    126.978294,   37.566681,  60, 127
    ```

---

### 3. 🌦 격자 → 1주일 단기예보 (기상청 API)
- 3시간 간격 최대 7일치 예보 데이터를 제공함
- Endpoint:  
  [GET] `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?pageNo=1&numOfRows=1000&dataType=JSON&base_date=20250522&base_time=0500&nx=55&ny=127&authKey=2rvTFXzSTpi70xV80l6YMg`
- **요청 파라미터**:
  | 인자명 | 의미 |
  |--------|------|
  | `pageNo` | 페이지 번호 |
  | `numOfRows` | 한 페이지 결과 수 |
  | `base_date` | 발표일자 (형식:YYYYMMDD) |
  | `base_time` | 발표시각 (정시 기준: 0200, 0500, 0800 등) |
  | `nx` | 예보지점 X 좌표 |
  | `ny` | 예보지점 Y 좌표 |
  | `dataType` | JSON |
  | `authKey` | 2rvTFXzSTpi70xV80l6YMg |
- **응답 파라미터**:
  | 인자명 | 의미 |
  |--------|------|
  | `numOfRows` | 한 페이지 결과 수 |
  | `pageNo` | 페이지 번호 |
  | `totalCount` | 데이터 총 개수 |
  | `resultCode` | 응답메시지 코드 |
  | `resultMsg` | 응답메시지 내용 |
  | `dataType` | 데이터 타입 |
  | `baseDate` | 발표일자 |
  | `baseTime` | 발표시각 |
  | `fcstDate` | 예보일자 |
  | `fcstTime` | 예보시각 |
  | `category` | 자료구분문자(아래 코드값 정보 확인) |
  | `fcstValue` | 예보 값 |
  | `nx` | 예보지점 X 좌표 |
  | `ny` | 예보지점 Y 좌표 |
- **카테고리 코드값 정보**:
  | 항목값 | 항목명 | 설명 |
  |--------|------|------|
  | `POP` | 강수확률 | 단위: % |
  | `SKY` | 하늘상태 | 맑음(1), 구름많음(3), 흐림(4) |
  | `TMP` | 1시간 기온 | 단위: ℃ |

- **응답 예시**:
    ```json
    {
        "response": {
            "header": {
            "resultCode": "00",
            "resultMsg": "NORMAL_SERVICE"
            },
            "body": {
            "dataType": "JSON",
            "items": {
                "item": [
                {
                    "baseDate": "YYYYMMDD",
                    "baseTime": "HHMM",
                    "category": "TMP",
                    "fcstDate": "YYYYMMDD",
                    "fcstTime": "HHMM",
                    "fcstValue": "22",
                    "nx": 55,
                    "ny": 127
                },
                ...
                ]
            },
            "numOfRows": 1000,
            "pageNo": 1,
            "totalCount": 742
            }
        }
    }
    ```
    


---

## 🔁 전체 처리 흐름
[도시명 입력] <br>
↓ <br>
Nominatim → 위도, 경도 <br>
↓ <br>
기상청 변환 API → 격자 nx, ny <br>
↓ <br>
기상청 예보 API → 날씨 데이터 <br>
↓ <br>
날짜별 날씨 카드로 렌더링

---

## 📦 제출 방식

- GitHub 리포지토리 생성 후 코드 업로드
- 제출: PR 또는 링크 공유

---

문의사항은 인터뷰어에게 자유롭게 질문하세요!

# 날씨 예보 API 연동 코딩 테스트

이 코딩 테스트는 지원자의 API 연동 구현 능력을 평가하기 위한 것입니다. 주어진 템플릿 프로젝트를 기반으로 필요한 API 호출 로직을 구현해야 합니다.

## 프로젝트 개요

이 애플리케이션은 사용자가 도시명을 입력하면 해당 도시의 당일 시간대별 날씨 예보를 보여주는 웹 애플리케이션입니다.

API 호출 프로세스:
1. 도시명 → 위경도 변환 (Nominatim API)
2. 위경도 → 격자 좌표 변환 (기상청 API)
3. 격자 좌표 → 날씨 예보 데이터 (기상청 API)

## 과제 설명

이 프로젝트에서 UI와 기본 구조는 이미 구현되어 있습니다. 지원자는 **API 연동 부분만 구현**하면 됩니다.

### 구현해야 할 파일

1. `utils/api.ts`: API 호출 함수들
   - `getCoordsFromCity`: 도시명 → 위경도 변환
   - `getGridFromCoords`: 위경도 → 격자 좌표 변환
   - `getWeatherForecast`: 격자 좌표 → 날씨 예보 데이터

2. `pages/api/geocode.ts`: 도시명 → 위경도 변환 API 라우트
3. `pages/api/grid.ts`: 위경도 → 격자 좌표 변환 API 라우트
4. `pages/api/weather.ts`: 격자 좌표 → 날씨 예보 데이터 API 라우트

모든 파일에는 TODO 주석과 상세한 API 정보가 포함되어 있습니다.

## 시작하기

1. 패키지 설치:
   ```
   npm install
   ```

2. 개발 서버 실행:
   ```
   npm run dev
   ```

3. 브라우저에서 http://localhost:3000 접속

## API 정보

### 1. 도시명 → 위경도 (Nominatim API)
- Endpoint: `https://nominatim.openstreetmap.org/search`
- 파라미터:
  - `q`: 도시명
  - `format`: json

### 2. 위경도 → 격자 좌표 (기상청 API)
- Endpoint: `https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_xy_lonlat`
- 파라미터:
  - `lon`: 경도
  - `lat`: 위도
  - `authKey`: 인증키 (2rvTFXzSTpi70xV80l6YMg)
- 응답 형식: 텍스트 (마지막 라인에서 X, Y 좌표 추출 필요)

### 3. 격자 좌표 → 날씨 예보 (기상청 API)
- Endpoint: `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst`
- 파라미터:
  - `pageNo`: 페이지 번호 (기본값: 1)
  - `numOfRows`: 한 페이지 결과 수 (기본값: 1000)
  - `dataType`: 응답 데이터 타입 (기본값: JSON)
  - `base_date`: 발표일자 (YYYYMMDD)
  - `base_time`: 발표시각 (HHMM)
  - `nx`: 예보지점 X 좌표
  - `ny`: 예보지점 Y 좌표
  - `authKey`: 인증키 (2rvTFXzSTpi70xV80l6YMg)

## 주의사항

- CORS 이슈를 피하기 위해 브라우저에서 직접 외부 API를 호출하지 말고, Next.js API 라우트를 통해 서버 사이드에서 호출해야 합니다.
- 각 함수와 API 라우트에는 적절한 오류 처리를 구현해야 합니다.
- 각 단계의 중간 결과(위경도, 격자 좌표)가 UI에 표시되므로 정확히 구현해야 합니다.
- 날씨 데이터 가공은 이미 `processWeatherData` 함수로 구현되어 있습니다.

## 평가 기준

1. API 호출 구현의 정확성
2. 오류 처리의 적절성
3. 코드 가독성 및 구조화
4. 비동기 처리 방식

제한 시간 내에 최대한 많은 기능을 구현해주세요. 모든 기능을 완성하지 못하더라도 구현한 부분까지 제출해주시면 됩니다.