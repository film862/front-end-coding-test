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