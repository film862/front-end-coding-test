/**
 * 날씨 예보 애플리케이션에서 사용하는 타입 정의
 * 각 API 응답과 데이터 구조에 대한 타입을 정의합니다.
 */

/**
 * Nominatim API 응답 타입
 * 도시명 → 위경도 변환 API 응답의 개별 항목 구조
 */
export interface NominatimResponse {
  place_id: number;    // 장소 ID
  lat: string;         // 위도
  lon: string;         // 경도
  display_name: string; // 표시 이름 (예: "서울, 대한민국")
}

/**
 * 격자 좌표 타입
 * 기상청 API에서 사용하는 X, Y 좌표 체계
 */
export interface GridCoords {
  nx: number;  // X 좌표 (동서 방향)
  ny: number;  // Y 좌표 (남북 방향)
}

/**
 * 기상청 API 응답 타입
 * 단기예보 API의 전체 응답 구조
 */
export interface WeatherApiResponse {
  response: {
    header: {
      resultCode: string;  // 결과 코드 (00: 정상)
      resultMsg: string;   // 결과 메시지
    };
    body: {
      dataType: string;    // 데이터 타입 (JSON)
      items: {
        item: WeatherItem[]; // 날씨 데이터 항목 배열
      };
      numOfRows: number;   // 한 페이지 결과 수
      pageNo: number;      // 페이지 번호
      totalCount: number;  // 전체 결과 수
    };
  };
}

/**
 * 기상청 API 응답 아이템 타입
 * 단기예보 API의 개별 날씨 데이터 항목
 */
export interface WeatherItem {
  baseDate: string;   // 발표일자 (YYYYMMDD)
  baseTime: string;   // 발표시각 (HHMM)
  category: string;   // 자료구분 (TMP: 기온, POP: 강수확률, SKY: 하늘상태 등)
  fcstDate: string;   // 예보일자 (YYYYMMDD)
  fcstTime: string;   // 예보시각 (HHMM)
  fcstValue: string;  // 예보값
  nx: number;         // 예보지점 X 좌표
  ny: number;         // 예보지점 Y 좌표
}

/**
 * 가공된 날씨 데이터 타입
 * 화면에 표시하기 위해 가공된 날씨 정보
 */
export interface WeatherData {
  date: string;                   // 날짜/시간 (시간대별 표시에서는 "HH:MM" 형식으로 사용)
  temperature: string;            // 기온 (°C)
  precipitationProbability: string; // 강수확률 (%)
  skyCondition: string;           // 하늘상태 (맑음, 구름많음, 흐림)
} 