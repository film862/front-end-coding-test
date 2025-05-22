import { useState } from 'react';
import Head from 'next/head';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  CircularProgress, 
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getCoordsFromCity, getGridFromCoords, getWeatherForecast } from '../utils/api';
import { WeatherData } from '../types/weather';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>('');
  
  // API 호출 단계 상태
  const [activeStep, setActiveStep] = useState(-1);
  const [coords, setCoords] = useState<{lat: string, lon: string} | null>(null);
  const [gridCoords, setGridCoords] = useState<{nx: number, ny: number} | null>(null);
  const [stepErrors, setStepErrors] = useState<string[]>(['', '', '']);

  const apiSteps = ['도시명 → 위경도', '위경도 → 격자 좌표', '격자 좌표 → 날씨 데이터'];

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('도시명을 입력해주세요.');
      return;
    }

    // 상태 초기화
    setLoading(true);
    setError(null);
    setWeatherData([]);
    setActiveStep(-1);
    setCoords(null);
    setGridCoords(null);
    setStepErrors(['', '', '']);

    try {
      // 1. 도시명 → 위경도
      setActiveStep(0);
      console.log('1. 도시명 → 위경도 호출 시작');
      try {
        const coordsData = await getCoordsFromCity(city);
        console.log('도시 좌표:', coordsData);
        setCoords(coordsData);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류';
        setStepErrors(prev => {
          const newErrors = [...prev];
          newErrors[0] = errorMsg;
          return newErrors;
        });
        throw new Error(`도시명 → 위경도 변환 실패: ${errorMsg}`);
      }
      
      // 2. 위경도 → 격자 좌표
      // coords가 null이 아닌 경우에만 진행
      if (coords) {
        setActiveStep(1);
        console.log('2. 위경도 → 격자 좌표 호출 시작');
        try {
          const gridCoordsData = await getGridFromCoords(coords.lat, coords.lon);
          console.log('격자 좌표:', gridCoordsData);
          setGridCoords(gridCoordsData);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류';
          setStepErrors(prev => {
            const newErrors = [...prev];
            newErrors[1] = errorMsg;
            return newErrors;
          });
          throw new Error(`위경도 → 격자 좌표 변환 실패: ${errorMsg}`);
        }
      } else {
        console.error('위경도 정보가 없어 격자 좌표 변환을 건너뜁니다.');
        return;
      }
      
      // 3. 격자 → 날씨 예보 데이터
      // gridCoords가 null이 아닌 경우에만 진행
      if (gridCoords) {
        setActiveStep(2);
        console.log('3. 격자 → 날씨 예보 데이터 호출 시작');
        try {
          const weatherForecast = await getWeatherForecast(gridCoords.nx, gridCoords.ny);
          console.log('날씨 데이터:', weatherForecast);
          setWeatherData(weatherForecast);
          setSearchedCity(city);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류';
          setStepErrors(prev => {
            const newErrors = [...prev];
            newErrors[2] = errorMsg;
            return newErrors;
          });
          throw new Error(`날씨 데이터 요청 실패: ${errorMsg}`);
        }
      } else {
        console.error('격자 좌표 정보가 없어 날씨 데이터 요청을 건너뜁니다.');
        return;
      }
      
    } catch (err) {
      console.error('API 호출 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Head>
        <title>날씨 예보 애플리케이션</title>
        <meta name="description" content="도시명으로 날씨 예보를 확인하세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container maxWidth="md" className="py-4">
        <Typography variant="h4" className="mb-4 text-center">
          날씨 예보 API 테스트
        </Typography>

        <Box component={Paper} elevation={3} className="p-4 mb-4">
          <Box className="flex flex-col sm:flex-row gap-2 mb-2">
            <TextField
              fullWidth
              label="도시명 입력"
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="예: 서울, 부산, 제주도"
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              disabled={loading}
              sx={{ whiteSpace: 'nowrap', minWidth: '80px' }}
            >
              검색
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary">
            도시명을 입력하면 해당 도시의 당일 시간대별 날씨를 확인할 수 있습니다.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* API 호출 단계 표시 */}
        {activeStep > -1 && (
          <Box component={Paper} elevation={3} className="p-4 mb-4">
            <Typography variant="h6" gutterBottom>
              API 호출 프로세스
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {apiSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel error={!!stepErrors[index]}>
                    {label}
                    {stepErrors[index] && (
                      <Typography variant="caption" color="error" display="block">
                        {stepErrors[index]}
                      </Typography>
                    )}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box className="mt-4">
              {coords && (
                <Box className="mb-2">
                  <Typography variant="subtitle2">위경도:</Typography>
                  <Typography variant="body2">위도: {coords.lat}, 경도: {coords.lon}</Typography>
                </Box>
              )}
              
              {gridCoords && (
                <Box className="mb-2">
                  <Typography variant="subtitle2">격자 좌표:</Typography>
                  <Typography variant="body2">X(nx): {gridCoords.nx}, Y(ny): {gridCoords.ny}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {loading && (
          <Box className="flex justify-center my-4">
            <CircularProgress />
          </Box>
        )}

        {/* 날씨 데이터 테이블 */}
        {weatherData.length > 0 && (
          <Box component={Paper} elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              {searchedCity}의 시간대별 날씨
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>시간</TableCell>
                    <TableCell>기온 (°C)</TableCell>
                    <TableCell>강수확률 (%)</TableCell>
                    <TableCell>하늘상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weatherData.map((weather, index) => (
                    <TableRow key={index}>
                      <TableCell>{weather.date}</TableCell>
                      <TableCell>{weather.temperature}</TableCell>
                      <TableCell>{weather.precipitationProbability}</TableCell>
                      <TableCell>
                        {weather.skyCondition === '맑음' && '☀️ '}
                        {weather.skyCondition === '구름많음' && '⛅ '}
                        {weather.skyCondition === '흐림' && '☁️ '}
                        {weather.skyCondition}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>
    </>
  );
}
