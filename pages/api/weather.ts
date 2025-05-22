import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
  }

  try {
    const { date, time, nx, ny } = req.query;

    // 필수 파라미터 확인
    if (!date || !time || !nx || !ny) {
      return res.status(400).json({ error: '필수 파라미터가 누락되었습니다.' });
    }

    // 기상청 API 호출
    const url = `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?pageNo=1&numOfRows=1000&dataType=JSON&base_date=${date}&base_time=${time}&nx=${nx}&ny=${ny}&authKey=2rvTFXzSTpi70xV80l6YMg`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('날씨 데이터를 가져오는데 실패했습니다.');
    }
    
    const data = await response.json();
    
    // API 응답 반환
    res.status(200).json(data);
  } catch (error) {
    console.error('API 에러:', error);
    res.status(500).json({ error: '날씨 데이터를 가져오는 중 오류가 발생했습니다.' });
  }
} 