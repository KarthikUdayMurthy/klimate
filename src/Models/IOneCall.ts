import { ICurrentWeather } from './ICurrentWeather';
import { IHourlyWeather } from './IHourlyWeather';
import { IDailyWeather } from './IDailyWeather';
import { IMinutelyWeather } from './IMinutelyWeather';

export interface IOneCall {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current?: ICurrentWeather;
  minutely?: IMinutelyWeather[];
  hourly?: IHourlyWeather[];
  daily?: IDailyWeather[];
}
