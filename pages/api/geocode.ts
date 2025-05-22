import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 도시명 → 위경도 변환을 위한 API 라우트
 * 
 * 이 API 라우트는 Nominatim API를 호출하여 도시명을 위경도 좌표로 변환합니다.
 * CORS 이슈를 해결하기 위해 서버 사이드에서 API를 호출합니다.
 * 
 * @param req NextApiRequest - city 쿼리 파라미터 필요
 * @param res NextApiResponse - 위경도 정보 또는 에러 응답
 * 
 * API 정보:
 * - Endpoint: https://nominatim.openstreetmap.org/search
 * - Method: GET
 * - 파라미터:
 *   - q: 도시명
 *   - format: json
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: 지원자가 구현해야 하는 부분
  // 1. GET 요청 확인
  // 2. city 쿼리 파라미터 확인
  // 3. Nominatim API 호출
  // 4. 응답 데이터 반환
  // 5. 오류 처리
  
  res.status(501).json({ error: '도시명 → 위경도 변환 API가 구현되지 않았습니다.' });
} 