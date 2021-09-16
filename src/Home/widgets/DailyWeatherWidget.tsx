import * as React from 'react';
import { IDailyWeather } from '../../Models';
import { getDateFromTimestamp } from '../../Util/util';
import { MoonPhase } from '../../Util/Components';

export interface DailyWeatherWidgetProps {
  data: IDailyWeather[];
  isSwiped: boolean;
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
      <span className="fontS font2 bold ml12">&nbsp;{val}</span>
    </div>
  );
};

const DailyWeatherWidget: React.FC<DailyWeatherWidgetProps> = ({
  data: dailyData,
  isSwiped,
}) => {
  const [showDetail, setShowDetail] = React.useState<number>(-1);

  const toggleDetail = (ind: number) => {
    setShowDetail(showDetail === ind ? -1 : ind);
  };

  return (
    <div
      className={
        'DailyWeatherWidget card ' +
        (isSwiped ? 'w3-animate-right' : 'w3-animate-opacity')
      }
    >
      {dailyData.map((data, ind) => (
        <div
          key={data.dt}
          className={
            'DailyWeatherWidgetItem ' + (isSwiped ? '' : 'w3-animate-top')
          }
          onClick={() => toggleDetail(ind)}
        >
          <div className="fR w100 fAiC fJcSb">
            <div className="alignL wsN fontS">
              <span className="bold font2">
                <i className="fas fa-calendar" />
                &nbsp;&nbsp;
                {ind === 0
                  ? 'Today'
                  : ind === 1
                  ? 'Tomorrow'
                  : getDateFromTimestamp(data.dt, false, 'ddd, Do MMM')}
              </span>
              <br />
              <span>{data.weather[0].description}</span>
            </div>
            <div className="alignR wsN">
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
              <div
                className="w3-show-inline-block ml12 fontS"
                style={{ verticalAlign: 'middle' }}
              >
                <span className="bold font2">
                  <i className="fas fa-temperature-high" />
                  &nbsp;{data.temp.max}&deg;C
                </span>
                <br />
                <span className="font2">
                  <i className="fas fa-temperature-low" />
                  &nbsp;{data.temp.min}&deg;C
                </span>
              </div>
            </div>
          </div>

          {showDetail === ind && (
            <div className="fR w100 fAiC fJcC mt12 w3-animate-opacity">
              <div className="wsN">
                {getDataPoint('Clouds', data.clouds + '%', 'fas fa-cloud')}
                {getDataPoint(
                  'Wind Speed',
                  data.wind_speed + ' km',
                  'fas fa-wind'
                )}
                {getDataPoint(
                  'Wind Direction',
                  data._wind_deg,
                  'fas fa-location-arrow'
                )}
                {getDataPoint('Humidity', data.humidity + '%', 'fas fa-tint')}
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
                <div className="fR w100 fAiC fJcSb mt18">
                  <div className="fontS font1 alignC wsN mr12">Moon Phase</div>
                  <MoonPhase value={data.moon_phase} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { DailyWeatherWidget };
