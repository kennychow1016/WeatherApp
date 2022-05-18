// STEP 1：從 react 中載入 useCallback
import React, { useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { ReactComponent as CloudyIcon } from './images/cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as CloudIcon } from './images/cloud.svg';
import { ReactComponent as RedoIcon } from './images/redo.svg';

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const Cloudy = styled(CloudyIcon)`
  flex-basis: 30%;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Cloud = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Redo = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const WeatherApp = () => {
  console.log('--- invoke function component ---');
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    cloud: 0,
  });

  // STEP 2：使用 useCallback 並將回傳的函式取名為 fetchData

  const fetchCurrentTime = () => {
    return fetch(
      'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-507B37E0-0383-4D8C-878D-628B54EC3536&locationName=臺北',
    )
      .then(response => response.json())
      .then(data => {
        const locationData = data.records.location[0];
        return {
          observationTime: locationData.time.obsTime,
        };
      });
  };
  
  const fetchCurrentWeather = () => {
    return fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=HongKong&lang=zh_tw&units=metric&appid=26ab550dc0f28c8bbc3f66697e18f48b"
    )
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const weatherElement = data;
      return {
        description: weatherElement.weather[0].description,
        temperature: weatherElement.main.temp,
        windSpeed: weatherElement.wind.speed,
        cloud: weatherElement.clouds.all
      };
    });
  };

  useEffect(() => {
    console.log('execute function in useEffect');
    // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
    const fetchData = async () => {
      // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      // STEP 6：使用陣列的解構賦值把資料取出
      const [currentTime, currentWeather] = await Promise.all([
        fetchCurrentTime(),
        fetchCurrentWeather(),
      ]);

      // STEP 7：把取得的資料透過物件的解構賦值放入
      setWeatherElement({
        ...currentTime,
        ...currentWeather,
      });
    };

    fetchData();
  }, []);

  return (
    <Container>
      {console.log('render')}
      <WeatherCard>
        <Location>香港</Location>
        <Description>
          {weatherElement.description}
        </Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(weatherElement.temperature)}
             <Celsius>°C</Celsius>
          </Temperature>
          <Cloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          {weatherElement.windSpeed} m/h
        </AirFlow>
        <Cloud>
          {/* cloud icon */}
          <CloudIcon /> 
          {weatherElement.cloud} 
          %
        </Cloud>
        <Redo onClick={() => {
            fetchCurrentTime();
            fetchCurrentWeather();
          }}>
          最後觀測時間：
          {new Intl.DateTimeFormat('zh-HK', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(weatherElement.observationTime))}{' '}
          <RedoIcon />
        </Redo>
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;
