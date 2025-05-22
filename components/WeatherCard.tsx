import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { WeatherData } from '../types/weather';

// 하늘상태별 아이콘 및 색상
const getSkyConditionStyle = (condition: string): { icon: string; bgColor: string } => {
  switch (condition) {
    case '맑음':
      return { icon: '☀️', bgColor: 'bg-blue-100' };
    case '구름많음':
      return { icon: '⛅', bgColor: 'bg-gray-200' };
    case '흐림':
      return { icon: '☁️', bgColor: 'bg-gray-300' };
    default:
      return { icon: '❓', bgColor: 'bg-white' };
  }
};

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const { date, temperature, precipitationProbability, skyCondition } = weather;
  const { icon, bgColor } = getSkyConditionStyle(skyCondition);

  // 날짜 포맷 변경 (YYYY-MM-DD -> MM월 DD일)
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <Card className={`${bgColor} transition-transform hover:scale-105 min-w-[200px]`}>
      <CardContent>
        <Typography variant="h6" className="font-bold mb-2">
          {formattedDate}
        </Typography>
        <Box className="flex flex-col items-center space-y-2">
          <Typography variant="h2" className="text-4xl mb-2">
            {icon}
          </Typography>
          <Typography variant="body1" className="font-medium">
            {skyCondition}
          </Typography>
          <Typography variant="h5" className="font-bold">
            {temperature}°C
          </Typography>
          <Typography variant="body2" color="text.secondary">
            강수확률: {precipitationProbability}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard; 