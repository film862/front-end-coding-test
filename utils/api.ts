import { NominatimResponse, GridCoords, WeatherApiResponse, WeatherData, WeatherItem } from '../types/weather';

// 도시명 → 위경도 변환 (내부 API 라우트를 통해 Nominatim API 호출)
export const getCoordsFromCity = async (cityName: string): Promise<{ lat: string; lon: string }> => {
  console.log(`[API 호출] 도시명 → 위경도 변환 시작: ${cityName}`);
  
  try {
    // 내부 API 라우트 호출
    const response = await fetch(
      `/api/geocode?city=${encodeURIComponent(cityName)}`
    );
    
    const responseStatus = `${response.status} ${response.statusText}`;
    console.log(`[API 응답] 상태: ${responseStatus}`);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패 (${responseStatus})`);
    }
    
    const data = await response.json() as NominatimResponse[];
    console.log(`[API 응답] 데이터 수신: ${data.length}개 결과`);
    
    if (data.length === 0) {
      throw new Error(`"${cityName}"에 대한 검색 결과가 없습니다.`);
    }
    
    const result = { lat: data[0].lat, lon: data[0].lon };
    console.log(`[API 성공] 위경도 변환 완료: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error('[API 오류] 도시명 → 위경도 변환 실패:', error);
    throw new Error(`도시 검색 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

// 위경도 → 격자 좌표 변환 (기상청 API 호출)
export const getGridFromCoords = async (lat: string, lon: string): Promise<GridCoords> => {
  console.log(`[API 호출] 위경도 → 격자 좌표 변환 시작: 위도=${lat}, 경도=${lon}`);
  
  try {
    // 내부 API 라우트 호출
    const response = await fetch(
      `/api/grid?lat=${lat}&lon=${lon}`
    );
    
    const responseStatus = `${response.status} ${response.statusText}`;
    console.log(`[API 응답] 상태: ${responseStatus}`);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패 (${responseStatus})`);
    }
    
    const data = await response.json();
    console.log(`[API 응답] 데이터 수신: ${JSON.stringify(data)}`);
    
    // API 응답에서 격자 좌표 추출
    if (!data.response || !data.response.body || !data.response.body.items) {
      throw new Error('응답 형식이 올바르지 않습니다.');
    }
    
    const { x, y } = data.response.body.items;
    
    if (x === undefined || y === undefined) {
      throw new Error('격자 좌표를 찾을 수 없습니다.');
    }
    
    const result = { nx: Number(x), ny: Number(y) };
    console.log(`[API 성공] 격자 좌표 변환 완료: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error('[API 오류] 위경도 → 격자 좌표 변환 실패:', error);
    throw new Error(`격자 좌표 변환 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

// 오늘 날짜와 시간 구하기 (YYYYMMDDHHmm 형식)
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

// 격자 → 날씨 예보 데이터 (내부 API 라우트를 통해 기상청 API 호출)
export const getWeatherForecast = async (nx: number, ny: number): Promise<WeatherData[]> => {
  const { date, time } = getDateTimeString();
  console.log(`[API 호출] 격자 → 날씨 예보 데이터 시작: nx=${nx}, ny=${ny}, 기준일자=${date}, 기준시간=${time}`);
  
  try {
    // 내부 API 라우트 호출
    const response = await fetch(
      `/api/weather?date=${date}&time=${time}&nx=${nx}&ny=${ny}`
    );
    
    const responseStatus = `${response.status} ${response.statusText}`;
    console.log(`[API 응답] 상태: ${responseStatus}`);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패 (${responseStatus})`);
    }
    
    const data = await response.json() as WeatherApiResponse;
    console.log(`[API 응답] 데이터 수신: 결과코드=${data.response.header.resultCode}`);
    
    if (data.response.header.resultCode !== "00") {
      throw new Error(`API 오류: ${data.response.header.resultMsg}`);
    }
    
    // 데이터 가공
    const weatherData = processWeatherData(data.response.body.items.item);
    console.log(`[API 성공] 날씨 데이터 처리 완료: ${weatherData.length}일 데이터`);
    return weatherData;
  } catch (error) {
    console.error('[API 오류] 날씨 데이터 요청 실패:', error);
    throw new Error(`날씨 데이터 요청 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

// 날씨 데이터 처리 함수
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