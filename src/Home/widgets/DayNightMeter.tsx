import * as React from 'react';
import { getCurrentTimeInHrs } from '../../Util/util';
import { Tooltip } from '../../Util/Components';

export interface DayNightMeterProps {
  _sunrise_hrs: number;
  _sunset_hrs: number;
}

const DayNightMeter: React.FC<DayNightMeterProps> = ({
  _sunrise_hrs,
  _sunset_hrs,
}) => {
  let [currentTime, setCurrentTime] = React.useState(getCurrentTimeInHrs());

  React.useEffect(() => {
    let interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInHrs());
    }, 600000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  let meterDivs = [];
  for (let i = 0; i < 24; i++) {
    let obj = { className: '', hourVal: 0, ampm: '' };
    if (
      i === parseInt(_sunrise_hrs.toString()) ||
      i === parseInt(_sunset_hrs.toString())
    ) {
      obj.className = 'twilight';
    } else if (i >= _sunrise_hrs && i <= _sunset_hrs) {
      obj.className = 'day';
    } else {
      obj.className = 'night';
    }

    if (i === parseInt(currentTime.toString())) {
      obj.className += ' current';
    }
    let j = i + 1;
    obj.hourVal = j > 12 ? j - 12 : j;
    obj.ampm = j >= 12 && j != 24 ? 'pm' : 'am';
    meterDivs.push(obj);
  }

  return (
    <div className="fR w100 fAiC fJcSb DayNightMeter">
      {meterDivs.map((m, i) => (
        <Tooltip
          direction={
            i === 0 ? 'right' : i === meterDivs.length - 1 ? 'left' : 'top'
          }
          text={m.hourVal + ' ' + m.ampm}
        >
          <div
            key={i}
            className={
              m.className + ' DayNightMeterItem font2 fontS fC fAiSb fJcC'
            }
          >
            {/* {m.hourVal} */}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export { DayNightMeter };
