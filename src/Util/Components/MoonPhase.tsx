import * as React from 'react';

interface MoonPhaseProps {
  value: number;
}

const MoonPhase: React.FC<MoonPhaseProps> = ({ value }) => {
  const size = 25;
  const fctr = size * 0.75 * value;
  console.log(value, fctr);
  const moonStyle = {
    boxShadow: `${fctr}px ${fctr * -1}px 0 0 white inset`
  };
  return (
    <div className="moonPhaseWrap fC fAiC fJcSb">
      <div className="moonPhase" style={moonStyle} />
      <div className="moonPhaseText fontS font2 mt6 wsN bold">
        {Math.round(value * 10000) / 100}%
      </div>
    </div>
  );
};

export { MoonPhase };
