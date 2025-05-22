// Nominatim API 응답 타입
export interface NominatimResponse {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

// 격자 좌표 타입
export interface GridCoords {
  nx: number;
  ny: number;
}

// 기상청 API 응답 타입
export interface WeatherApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: WeatherItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 기상청 API 응답 아이템 타입
export interface WeatherItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

// 가공된 날씨 데이터 타입
export interface WeatherData {
  date: string;
  temperature: string;
  precipitationProbability: string;
  skyCondition: string;
} 