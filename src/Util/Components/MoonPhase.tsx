import * as React from 'react';

interface MoonPhaseProps {
  value: number;
}

const MoonPhase: React.FC<MoonPhaseProps> = ({ value }) => {
  let phaseVal: number = value * 2;
  phaseVal = phaseVal > 1 ? 2 - phaseVal : phaseVal;
  const size = 25;
  let fctr = 0;
  if (phaseVal < 0.75) {
    fctr = size * 0.5 * phaseVal;
  } else if (phaseVal >= 0.75 && phaseVal < 0.98) {
    fctr = size * 0.66 * phaseVal;
  } else {
    fctr = size * 0.75 * phaseVal;
  }
  const moonStyle = {
    boxShadow: `${fctr}px ${fctr * -1}px 0 0 white inset`
  };
  return (
    <div className="moonPhaseWrap fC fAiC fJcSb">
      <div className="moonPhase" style={moonStyle} />
      <div className="moonPhaseText fontS font2 mt6 wsN bold">
        {Math.round(phaseVal * 10000) / 100}%
      </div>
    </div>
  );
};

export { MoonPhase };
