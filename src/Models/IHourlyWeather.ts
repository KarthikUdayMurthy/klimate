import { IMainWeather } from './IMainWeather';

export interface IHourlyWeather {
  dt: number;
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
  wind_gust: number;
  weather: IMainWeather[];
  pop: number;

  // extra props
  _dayLight?: string;
}
