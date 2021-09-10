import { IMainWeather } from './IMainWeather';

export interface IDailyWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: IMainWeather[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;

  // extra props
  _wind_deg?: string;
  _sunrise_hrs?: number;
  _sunset_hrs?: number;
}
