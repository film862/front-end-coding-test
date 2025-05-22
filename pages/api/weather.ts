import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 격자 좌표 → 날씨 예보 데이터 조회를 위한 API 라우트
 * 
 * 이 API 라우트는 기상청 단기예보 API를 호출하여 날씨 예보 데이터를 조회합니다.
 * CORS 이슈를 해결하기 위해 서버 사이드에서 API를 호출합니다.
 * 
 * @param req NextApiRequest - date, time, nx, ny 쿼리 파라미터 필요
 * @param res NextApiResponse - 날씨 예보 데이터 또는 에러 응답
 * 
 * API 정보:
 * - Endpoint: https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst
 * - Method: GET
 * - 파라미터:
 *   - pageNo: 페이지 번호 (기본값: 1)
 *   - numOfRows: 한 페이지 결과 수 (기본값: 1000)
 *   - dataType: 응답 데이터 타입 (기본값: JSON)
 *   - base_date: 발표일자 (YYYYMMDD)
 *   - base_time: 발표시각 (HHMM)
 *   - nx: 예보지점 X 좌표
 *   - ny: 예보지점 Y 좌표
 *   - authKey: 인증키 (2rvTFXzSTpi70xV80l6YMg)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: 지원자가 구현해야 하는 부분
  // 1. GET 요청 확인
  // 2. date, time, nx, ny 쿼리 파라미터 확인
  // 3. 기상청 단기예보 API 호출
  // 4. 응답 데이터 반환
  // 5. 오류 처리
  
  res.status(501).json({ error: '격자 좌표 → 날씨 예보 데이터 API가 구현되지 않았습니다.' });
} 