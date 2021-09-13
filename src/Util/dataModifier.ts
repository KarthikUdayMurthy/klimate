import { IOneCall } from '../Models/IOneCall';
import { ICurrentWeather, IDailyWeather, IHourlyWeather } from '../Models';
import { getHoursFromTimestamp, isToday, isAfter } from '../Util/util';

export default function dataModifier(data: IOneCall): IOneCall {
  let d: IOneCall = Object.assign({}, data);
  d.current = modifyCurrent(d.current);
  d.daily = d.daily.map(dly => modifyDaily(dly));
  d.hourly = d.hourly
    .filter(({ dt }) => isToday(dt) && isAfter(dt))
    .map(hrly => modifyHourly(hrly, d.current));
  return d;
}

const modifyCurrent = (c: ICurrentWeather): ICurrentWeather => {
  return {
    ...c,
    temp: Math.round(c.temp),
    feels_like: Math.round(c.feels_like),
    wind_speed: Math.round((c.wind_speed * 3600) / 1000),
    visibility: Math.round(c.visibility / 1000),
    dew_point: Math.round(c.dew_point),
    _wind_deg: degToCard(c.wind_deg),
    _sunrise_hrs: Math.round(getHoursFromTimestamp(c.sunrise) * 100) / 100,
    _sunset_hrs: Math.round(getHoursFromTimestamp(c.sunset) * 100) / 100
  };
};

const modifyHourly = (
  c: IHourlyWeather,
  { _sunrise_hrs, _sunset_hrs }: ICurrentWeather
): IHourlyWeather => {
  return {
    ...c,
    temp: Math.round(c.temp),
    feels_like: Math.round(c.feels_like),
    wind_speed: Math.round((c.wind_speed * 3600) / 1000),
    visibility: Math.round(c.visibility / 1000),
    dew_point: Math.round(c.dew_point),
    pop: Math.round(c.pop * 10000) / 100,
    _dayLight: getDayLight(
      Math.round(getHoursFromTimestamp(c.dt) * 100) / 100,
      _sunrise_hrs,
      _sunset_hrs
    )
  };
};

const modifyDaily = (c: IDailyWeather): IDailyWeather => {
  return {
    ...c,
    temp: {
      day: Math.round(c.temp.day),
      min: Math.round(c.temp.min),
      max: Math.round(c.temp.max),
      eve: Math.round(c.temp.eve),
      night: Math.round(c.temp.night),
      morn: Math.round(c.temp.morn)
    },
    feels_like: {
      day: Math.round(c.feels_like.day),
      night: Math.round(c.feels_like.night),
      eve: Math.round(c.feels_like.eve),
      morn: Math.round(c.feels_like.morn)
    },
    wind_speed: Math.round((c.wind_speed * 3600) / 1000),
    dew_point: Math.round(c.dew_point),
    pop: Math.round(c.pop * 10000) / 100,
    _wind_deg: degToCard(c.wind_deg),
    _sunrise_hrs: Math.round(getHoursFromTimestamp(c.sunrise) * 100) / 100,
    _sunset_hrs: Math.round(getHoursFromTimestamp(c.sunset) * 100) / 100
  };
};

const degToCard = function(deg: number): string {
  if (deg > 11.25 && deg <= 33.75) {
    return 'NNE';
  } else if (deg > 33.75 && deg <= 56.25) {
    return 'ENE';
  } else if (deg > 56.25 && deg <= 78.75) {
    return 'E';
  } else if (deg > 78.75 && deg <= 101.25) {
    return 'ESE';
  } else if (deg > 101.25 && deg <= 123.75) {
    return 'ESE';
  } else if (deg > 123.75 && deg <= 146.25) {
    return 'SE';
  } else if (deg > 146.25 && deg <= 168.75) {
    return 'SSE';
  } else if (deg > 168.75 && deg <= 191.25) {
    return 'S';
  } else if (deg > 191.25 && deg <= 213.75) {
    return 'SSW';
  } else if (deg > 213.75 && deg <= 236.25) {
    return 'SW';
  } else if (deg > 236.25 && deg <= 258.75) {
    return 'WSW';
  } else if (deg > 258.75 && deg <= 281.25) {
    return 'W';
  } else if (deg > 281.25 && deg <= 303.75) {
    return 'WNW';
  } else if (deg > 303.75 && deg <= 326.25) {
    return 'NW';
  } else if (deg > 326.25 && deg <= 348.75) {
    return 'NNW';
  } else {
    return 'N';
  }
};

const getDayLight = (
  hr: number,
  _sunrise_hrs: number,
  _sunset_hrs: number
): string => {
  if (
    parseInt(hr.toString()) === parseInt(_sunrise_hrs.toString()) ||
    parseInt(hr.toString()) === parseInt(_sunset_hrs.toString())
  ) {
    return 'twilight';
  } else if (hr >= _sunrise_hrs && hr <= _sunset_hrs) {
    return 'day';
  } else {
    return 'night';
  }
};
