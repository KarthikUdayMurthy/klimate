import * as React from 'react';
import { IHourlyWeather } from '../../Models';
import { getDateFromTimestamp } from '../../Util/util';

export interface HourlyWeatherWidgetProps {
  data: IHourlyWeather[];
  isSwiped: boolean;
}

const getDataPoint = (val: any, iconClass?: string): React.ReactNode => {
  return (
    <div className="fR fAiC fJcSb mt6">
      <span className="fontS font1">
        {iconClass && (
          <i
            className={iconClass + ' fontM'}
            style={{ width: '20px', height: '20px', verticalAlign: 'middle' }}
          />
        )}
        {iconClass && String.fromCharCode(160)}
        <span className="fontS font2 bold">{val}</span>
      </span>
    </div>
  );
};

const HourlyWeatherWidget: React.FC<HourlyWeatherWidgetProps> = ({
  data: hourlyData,
  isSwiped,
}) => {
  return (
    <div
      className={
        'HourlyWeatherWidget mt12 ' + (isSwiped ? '' : 'w3-animate-left')
      }
    >
      {hourlyData.map((data) => (
        <div
          key={data.dt}
          className={'HourlyWeatherWidgetItem ' + data._dayLight}
        >
          <div className="fR w100 fAiC fJcSb">
            <div className="fontS font1 mr12">
              <span className="wsN fontS font2 bold">
                {getDateFromTimestamp(data.dt, false, 'h a')}
              </span>
              <br />
              <span className="wsN fontS font2">{data.weather[0].main}</span>
            </div>
            <div
              style={{
                backgroundImage:
                  'url(https://openweathermap.org/img/wn/' +
                  data.weather[0].icon +
                  '@2x.png)',
              }}
              title={data.weather[0].main}
              className="imgDiv"
            />
          </div>
          <div className="fR w100 fAiC fJcSb mt6">
            <div className="alignL wsN mr12">
              {getDataPoint(
                data.temp + String.fromCharCode(176) + 'C',
                'fas fa-thermometer-half'
              )}
            </div>
            <div className="alignR wsN ml12">
              {getDataPoint(data.pop + '%', 'fas fa-cloud-rain')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { HourlyWeatherWidget };
