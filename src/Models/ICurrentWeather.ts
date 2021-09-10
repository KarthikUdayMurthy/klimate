import { IMainWeather } from './IMainWeather';

export interface ICurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: IMainWeather[];

  // extra props
  _wind_deg?: string;
  _sunrise_hrs?: number;
  _sunset_hrs?: number;
}
