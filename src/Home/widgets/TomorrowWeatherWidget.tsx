import * as React from 'react';
import { IDailyWeather } from '../../Models';
import { getDateFromTimestamp } from '../../Util/util';
import { DayNightMeter } from './DayNightMeter';

export interface TomorrowWeatherWidgetProps {
  data: IDailyWeather;
}

const getDataPoint = (
  label: string,
  val: any,
  iconClass?: string
): React.ReactNode => {
  return (
    <div className="fR fAiC fJcSb mt6">
      <span className="fontS font1 mr12">
        {iconClass && (
          <i
            className={iconClass + ' fontM'}
            style={{ width: '20px', height: '20px', verticalAlign: 'middle' }}
          />
        )}
        {iconClass && String.fromCharCode(160)}
        {label}
      </span>
      <span className="fontS font2 bold">&nbsp;{val}</span>
    </div>
  );
};

const TomorrowWeatherWidget: React.FC<TomorrowWeatherWidgetProps> = ({
  data
}) => {
  return (
    <div className="TomorrowWeatherWidget card w3-animate-opacity">
      <div className="fC w100 fAiSb fJcC">
        <div className="fR w100 fAiC fJcC mb12 wsN fontM">
          <i className="fas fa-calendar" />
          <span className="fontM font2 bold">
            &nbsp;&nbsp;
            {getDateFromTimestamp(data.dt, false, 'ddd, Do MMM')}
          </span>
        </div>

        <div className="fR w100 fAiC fJcSb">
          <div className="wsN mr12">
            <div
              style={{
                backgroundImage:
                  'url(https://openweathermap.org/img/wn/' +
                  data.weather[0].icon +
                  '@2x.png)'
              }}
              title={data.weather[0].main}
              className="imgDiv"
            />
            <div
              className="w3-show-inline-block w3-margin-left alignL"
              style={{ verticalAlign: 'middle' }}
            >
              <span className="fontL">{data.weather[0].main}</span>
              <br />
              <span className="fontS">{data.weather[0].description}</span>
            </div>
          </div>
          <div className="alignR wsN">
            <span className="fontM font2">
              <i className="fas fa-temperature-high" />
              &nbsp;{data.temp.max}&deg;C
            </span>
            <br />
            <span className="fontM font2">
              <i className="fas fa-temperature-low" />
              &nbsp;{data.temp.min}&deg;C
            </span>
          </div>
        </div>

        <div className="fR w100 fAiC fJcSb mt12">
          <div className="alignL wsN mr12">
            {getDataPoint('Clouds', data.clouds + '%', 'fas fa-cloud')}
            {getDataPoint('Wind Speed', data.wind_speed + ' km', 'fas fa-wind')}
            {getDataPoint(
              'Wind Direction',
              data._wind_deg,
              'fas fa-location-arrow'
            )}
            {getDataPoint('Humidity', data.humidity + '%', 'fas fa-tint')}
          </div>
          <div className="alignR wsN">
            {getDataPoint(
              'Dew Point',
              data.dew_point + String.fromCharCode(176) + 'C',
              'fas fa-thermometer-half'
            )}
            {getDataPoint(
              'Pressure',
              data.pressure,
              'fas fa-angle-double-down'
            )}
            {getDataPoint('UV Index', data.uvi, 'fas fa-fire')}
            {getDataPoint('pop', data.pop + '%', 'fas fa-cloud-rain')}
          </div>
        </div>
        <div className="fR w100 fAiC fJcSb mt18">
          <div className="alignL wsN mr12">
            {getDataPoint(
              'Sunrise',
              getDateFromTimestamp(data.sunrise, false, 'hh:mm'),
              'fas fa-sun'
            )}
          </div>
          <div className="alignR wsN">
            {getDataPoint(
              'Sunset',
              getDateFromTimestamp(data.sunset, false, 'hh:mm'),
              'fas fa-moon'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TomorrowWeatherWidget };
