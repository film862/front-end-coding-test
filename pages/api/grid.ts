import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 위경도 → 격자 좌표 변환을 위한 API 라우트
 * 
 * 이 API 라우트는 기상청 좌표변환 API를 호출하여 위경도를 격자 좌표로 변환합니다.
 * CORS 이슈를 해결하기 위해 서버 사이드에서 API를 호출합니다.
 * 
 * @param req NextApiRequest - lat, lon 쿼리 파라미터 필요
 * @param res NextApiResponse - 격자 좌표 정보 또는 에러 응답
 * 
 * API 정보:
 * - Endpoint: https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_xy_lonlat
 * - Method: GET
 * - 파라미터:
 *   - lon: 경도
 *   - lat: 위도
 *   - authKey: 인증키 (2rvTFXzSTpi70xV80l6YMg)
 * - 응답 예시(텍스트):
 *   #START7777
 *   #       LON,         LAT,   X,   Y
 *   126.978294,   37.566681,  60, 127
 * 
 * 주의: 응답이 JSON이 아닌 텍스트 형식으로 옵니다. 
 * 마지막 라인의 네 번째 값이 X좌표(nx), 다섯 번째 값이 Y좌표(ny)입니다.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: 지원자가 구현해야 하는 부분
  // 1. GET 요청 확인
  // 2. lat, lon 쿼리 파라미터 확인
  // 3. 기상청 좌표변환 API 호출
  // 4. 텍스트 응답 파싱하여 X, Y 값 추출
  // 5. JSON 형식으로 응답 데이터 반환
  // 6. 오류 처리
  
  res.status(501).json({ error: '위경도 → 격자 좌표 변환 API가 구현되지 않았습니다.' });
} 