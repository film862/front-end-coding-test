import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
  }

  try {
    const { city } = req.query;

    // 필수 파라미터 확인
    if (!city) {
      return res.status(400).json({ error: '도시명이 누락되었습니다.' });
    }

    // Nominatim API 호출
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city as string)}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('도시 검색에 실패했습니다.');
    }
    
    const data = await response.json();
    
    // API 응답 반환
    res.status(200).json(data);
  } catch (error) {
    console.error('API 에러:', error);
    res.status(500).json({ error: '위치 검색 중 오류가 발생했습니다.' });
  }
} 