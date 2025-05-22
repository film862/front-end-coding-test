import { NominatimResponse, GridCoords, WeatherApiResponse, WeatherData, WeatherItem } from '../types/weather';

/**
 * 도시명을 위경도 좌표로 변환하는 함수
 * 
 * @param cityName 검색할 도시명
 * @returns Promise<{ lat: string; lon: string }> 위도와 경도 정보
 * 
 * API 정보:
 * - Endpoint: https://nominatim.openstreetmap.org/search
 * - Method: GET
 * - 파라미터:
 *   - q: 도시명
 *   - format: json
 * - 응답 예시:
 *   [{"place_id":296587607,"licence":"Data © OpenStreetMap contributors...","lat":"37.5666791","lon":"126.9782914",...}]
 * 
 * 주의: CORS 이슈를 피하기 위해 내부 API 라우트를 사용합니다.
 * 호출할 내부 API 라우트: `/api/geocode?city=${encodeURIComponent(cityName)}`
 */
export const getCoordsFromCity = async (cityName: string): Promise<{ lat: string; lon: string }> => {
  // TODO: 지원자가 구현해야 하는 부분
  // 1. `/api/geocode?city=${encodeURIComponent(cityName)}` API 호출
  // 2. 응답 데이터에서 위도(lat)와 경도(lon) 추출하여 반환
  // 3. 오류 처리 구현
  
  throw new Error('도시명 → 위경도 변환 함수가 구현되지 않았습니다.');
};

/**
 * 위경도 좌표를 기상청 격자 좌표로 변환하는 함수
 * 
 * @param lat 위도
 * @param lon 경도
 * @returns Promise<GridCoords> 기상청 격자 좌표 (nx, ny)
 * 
 * API 정보:
 * - Endpoint: https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_xy_lonlat
 * - Method: GET
 * - 파라미터:
 *   - lon: 경도
 *   - lat: 위도
 *   - authKey: 인증키
 * - 응답 예시(텍스트):
 *   #START7777
 *   #       LON,         LAT,   X,   Y
 *   126.978294,   37.566681,  60, 127
 * 
 * 주의: CORS 이슈를 피하기 위해 내부 API 라우트를 사용합니다.
 * 호출할 내부 API 라우트: `/api/grid?lat=${lat}&lon=${lon}`
 */
export const getGridFromCoords = async (lat: string, lon: string): Promise<GridCoords> => {
  // TODO: 지원자가 구현해야 하는 부분
  // 1. `/api/grid?lat=${lat}&lon=${lon}` API 호출
  // 2. 응답 데이터에서 격자 좌표(nx, ny) 추출하여 반환
  // 3. 오류 처리 구현
  
  throw new Error('위경도 → 격자 좌표 변환 함수가 구현되지 않았습니다.');
};

/**
 * 현재 날짜와 시간을 기상청 API 호출에 적합한 형식으로 반환하는 유틸리티 함수
 * 
 * @returns { date: string; time: string } 날짜(YYYYMMDD)와 시간(HHMM) 정보
 */
const getDateTimeString = (): { date: string; time: string } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // 기상청 API는 02, 05, 08, 11, 14, 17, 20, 23시에 업데이트됨
  // 가장 최근 발표 시간을 사용
  const currentHour = now.getHours();
  
  if (currentHour < 2) {
    // 전날 23시 발표 데이터 사용
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yesterdayDay = String(yesterday.getDate()).padStart(2, '0');
    
    return {
      date: `${yesterdayYear}${yesterdayMonth}${yesterdayDay}`,
      time: '2300'
    };
  } else {
    // 가장 최근 발표 시간 찾기
    const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];
    let nearestTime = 23;
    
    for (const time of baseTimes) {
      if (currentHour >= time) {
        nearestTime = time;
      }
    }
    
    const baseTime = String(nearestTime).padStart(2, '0') + '00';
    return {
      date: `${year}${month}${day}`,
      time: baseTime
    };
  }
};

/**
 * 격자 좌표로 날씨 예보 데이터를 조회하는 함수
 * 
 * @param nx 격자 X 좌표
 * @param ny 격자 Y 좌표
 * @returns Promise<WeatherData[]> 시간대별 날씨 데이터 배열
 * 
 * API 정보:
 * - Endpoint: https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst
 * - Method: GET
 * - 파라미터:
 *   - pageNo: 페이지 번호
 *   - numOfRows: 한 페이지 결과 수
 *   - dataType: JSON
 *   - base_date: 발표일자 (YYYYMMDD)
 *   - base_time: 발표시각 (HHMM)
 *   - nx: 예보지점 X 좌표
 *   - ny: 예보지점 Y 좌표
 *   - authKey: 인증키
 * 
 * 주의: CORS 이슈를 피하기 위해 내부 API 라우트를 사용합니다.
 * 호출할 내부 API 라우트: `/api/weather?date=${date}&time=${time}&nx=${nx}&ny=${ny}`
 */
export const getWeatherForecast = async (nx: number, ny: number): Promise<WeatherData[]> => {
  // TODO: 지원자가 구현해야 하는 부분
  // 1. getDateTimeString() 함수를 사용하여 현재 날짜와 시간 가져오기
  // 2. `/api/weather?date=${date}&time=${time}&nx=${nx}&ny=${ny}` API 호출
  // 3. 응답 데이터를 processWeatherData 함수를 사용하여 가공 후 반환
  // 4. 오류 처리 구현
  
  throw new Error('격자 좌표 → 날씨 예보 데이터 함수가 구현되지 않았습니다.');
};

/**
 * 기상청 API 응답 데이터를 가공하여 화면에 표시하기 좋은 형태로 변환하는 함수
 * 이 함수는 이미 구현되어 있으므로 수정할 필요가 없습니다.
 * 
 * @param items 기상청 API 응답 데이터의 items.item 배열
 * @returns WeatherData[] 가공된 날씨 데이터 배열
 */
const processWeatherData = (items: WeatherItem[]): WeatherData[] => {
  console.log(`[데이터 처리] 원본 데이터 항목 수: ${items.length}`);
  
  // 오늘 날짜 구하기 (YYYYMMDD 형식)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}${month}${day}`;
  
  console.log(`[데이터 처리] 오늘 날짜: ${todayString}`);
  
  // 당일 데이터만 필터링
  const todayItems = items.filter(item => item.fcstDate === todayString);
  console.log(`[데이터 처리] 당일 데이터 항목 수: ${todayItems.length}`);
  
  // 시간대별로 그룹화
  const groupedByTime: Record<string, WeatherItem[]> = {};
  
  todayItems.forEach(item => {
    if (!groupedByTime[item.fcstTime]) {
      groupedByTime[item.fcstTime] = [];
    }
    groupedByTime[item.fcstTime].push(item);
  });
  
  // 각 시간대별로 필요한 데이터 추출
  const weatherDataArray: WeatherData[] = [];
  const times = Object.keys(groupedByTime).sort();
  
  times.forEach(time => {
    const timeItems = groupedByTime[time];
    
    let temperature = '';
    let precipitationProbability = '';
    let skyCondition = '';
    
    timeItems.forEach(item => {
      if (item.category === 'TMP') {
        temperature = item.fcstValue;
      } else if (item.category === 'POP') {
        precipitationProbability = item.fcstValue;
      } else if (item.category === 'SKY') {
        // 하늘상태: 맑음(1), 구름많음(3), 흐림(4)
        skyCondition = item.fcstValue === '1' ? '맑음' :
                      item.fcstValue === '3' ? '구름많음' :
                      item.fcstValue === '4' ? '흐림' : '알 수 없음';
      }
    });
    
    // 시간 형식 변환 (0700 -> 07:00)
    const formattedTime = `${time.substring(0, 2)}:${time.substring(2, 4)}`;
    
    weatherDataArray.push({
      date: formattedTime, // date 필드를 시간으로 사용
      temperature,
      precipitationProbability,
      skyCondition
    });
  });
  
  return weatherDataArray;
}; 