import * as React from 'react';

interface TooltipProps {
  text: string;
  direction: 'left' | 'right' | 'top' | 'bottom';
  onHover?: boolean;
  onClick?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, direction }) => {
  const currentTooltipRef = React.useRef<HTMLDivElement>(null);

  const showCurrentTooltip = () => {
    const allTooltips = [...document.getElementsByClassName('tooltipWrap')];
    allTooltips.forEach((t) => ((t as HTMLDivElement).style.display = 'none'));
    currentTooltipRef.current.style.display = 'block';
  };

  return (
    <div className="tooltipHost" onClick={showCurrentTooltip}>
      <div
        className={'tooltipWrap fontS font2 w3-animate-opacity ' + direction}
        ref={currentTooltipRef}
      >
        {text}
      </div>
      {children}
    </div>
  );
};

export { Tooltip };
