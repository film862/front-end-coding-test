# 날씨 예보 API 연동 코딩 테스트

이 코딩 테스트는 지원자의 API 연동 구현 능력을 평가하기 위한 것입니다. 주어진 템플릿 프로젝트를 기반으로 필요한 API 호출 로직을 구현해야 합니다.

## 프로젝트 개요

이 애플리케이션은 사용자가 도시명을 입력하면 해당 도시의 당일 시간대별 날씨 예보를 보여주는 웹 애플리케이션입니다.

API 호출 프로세스:
1. 도시명 → 위경도 변환 (Nominatim API)
2. 위경도 → 격자 좌표 변환 (기상청 API)
3. 격자 좌표 → 날씨 예보 데이터 (기상청 API)

## 과제 설명

이 프로젝트에서 UI와 기본 구조는 이미 구현되어 있습니다. 
지원자는 **API 연동 부분만 구현**하면 됩니다.


### 구현해야 할 파일

1. `pages/api/geocode.ts`: 도시명 → 위경도 변환 API 라우트
2. `pages/api/grid.ts`: 위경도 → 격자 좌표 변환 API 라우트
3. `pages/api/weather.ts`: 격자 좌표 → 날씨 예보 데이터 API 라우트

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
- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **요청 파라미터**:
  - `q`: 도시명
  - `format`: json
- **응답 파라미터**:
  - `lat` " 위도
  - `lon` : 경도 
### 2. 위경도 → 격자 좌표 (기상청 API)
- **Endpoint**: `https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_xy_lonlat`
- **요청 파라미터**:
  - `lon`: 경도
  - `lat`: 위도
  - `authKey`: 인증키 (2rvTFXzSTpi70xV80l6YMg)
- **응답 형식**: 텍스트 (마지막 라인에서 X, Y 좌표 추출 필요)
    ```
    #START7777
    #       LON,         LAT,   X,   Y
    126.978294,   37.566681,  60, 127
    ```

### 3. 격자 좌표 → 날씨 예보 (기상청 API)
- **Endpoint**: `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst`
- **요청 파라미터**:
  - `pageNo`: 페이지 번호 (기본값: 1)
  - `numOfRows`: 한 페이지 결과 수 (기본값: 1000)
  - `dataType`: 응답 데이터 타입 (기본값: JSON)
  - `base_date`: 발표일자 (YYYYMMDD)
  - `base_time`: 발표시각 (HHMM)
  - `nx`: 예보지점 X 좌표
  - `ny`: 예보지점 Y 좌표
  - `authKey`: 인증키 (2rvTFXzSTpi70xV80l6YMg)
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

## 주의사항
- CORS 이슈를 피하기 위해 브라우저에서 직접 외부 API를 호출하지 말고, Next.js API 라우트를 통해 서버 사이드에서 호출해야 합니다.
- 각 함수와 API 라우트에는 적절한 오류 처리를 구현해야 합니다.
- 각 단계의 중간 결과(위경도, 격자 좌표)가 UI에 표시되므로 정확히 구현해야 합니다.
- 날씨 데이터 가공은 이미 `processWeatherData` 함수로 구현되어 있습니다.


## 제출 방식
- GitHub 리포지토리 생성 후 코드 업로드
- 제출: 링크 공유


## 구현 우선순위 및 제출 지침

### 중요 사항
- **기능 구현이 최우선입니다.** 애플리케이션이 정상적으로 실행되고 기본 기능이 동작하는 것이 가장 중요합니다.
- 에러 처리가 완벽하지 않더라도 기본 기능이 동작하는 코드를 우선 작성해주세요.
- 완성하지 못한 코드라도 **절대 지우지 마세요**. 시도한 흔적(주석 포함)도 평가에 반영됩니다.

### 시간이 남는 경우 추가 구현
시간이 남는다면 다음 항목을 개선해보세요:
- 오류 처리 강화
- 코드 가독성 개선
- 주석 추가
- API 응답 캐싱 구현
- 사용자 피드백 개선

제한 시간 내에 가능한 만큼만 구현해주세요. 모든 기능을 완성하지 못하더라도 구현한 부분까지 제출해주시면 됩니다.