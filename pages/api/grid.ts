import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
  }

  try {
    const { lat, lon } = req.query;

    // 필수 파라미터 확인
    if (!lat || !lon) {
      return res.status(400).json({ error: '위도와 경도가 누락되었습니다.' });
    }

    // README에 명시된 API 엔드포인트 사용
    const url = `https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_xy_lonlat?lon=${lon}&lat=${lat}&authKey=2rvTFXzSTpi70xV80l6YMg`;
    console.log('요청 URL:', url);
    
    const response = await fetch(url);
    
    console.log('응답 상태:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('응답 데이터:', responseText);

    if (!response.ok) {
      throw new Error(`좌표 변환에 실패했습니다. 상태 코드: ${response.status}`);
    }
    
    // 텍스트 응답 파싱
    try {
      // 행으로 분리
      const lines = responseText.trim().split('\n');
      
      // 실제 데이터가 있는 마지막 행 가져오기 (예: " 126.978294,   37.566681,  60, 127")
      const dataLine = lines[lines.length - 1];
      
      // 콤마로 분리하여 값 추출
      const values = dataLine.trim().split(',');
      
      if (values.length >= 4) {
        const x = parseInt(values[2].trim()); // X 값 (nx)
        const y = parseInt(values[3].trim()); // Y 값 (ny)
        
        // 형식에 맞게 응답 구성
        const result = {
          response: {
            header: {
              resultCode: "00",
              resultMsg: "NORMAL_SERVICE"
            },
            body: {
              items: {
                x,
                y
              }
            }
          }
        };
        
        // API 응답 반환
        return res.status(200).json(result);
      } else {
        throw new Error('응답 형식이 올바르지 않습니다.');
      }
    } catch (parseError) {
      console.error('응답 파싱 오류:', parseError);
      return res.status(500).json({ error: '응답 파싱에 실패했습니다.' });
    }
  } catch (error) {
    console.error('API 에러:', error);
    res.status(500).json({ error: '좌표 변환 중 오류가 발생했습니다.' });
  }
} 