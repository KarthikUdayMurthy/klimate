import * as React from 'react';

interface TooltipProps {
  text: string;
  direction: 'left' | 'right' | 'top' | 'bottom';
  onHover?: boolean;
  onClick?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  direction,
  onClick = false,
  onHover = false,
}) => {
  if (!onClick) {
    onHover = true;
  }

  const currentTooltipRef = React.useRef<HTMLDivElement>(null);

  if (onClick) {
    React.useEffect(() => {
      document.body.addEventListener('click', checkAndRemoveTooltip);
      return () => {
        document.body.removeEventListener('click', checkAndRemoveTooltip);
      };
    }, []);
  }

  const checkAndRemoveTooltip = (evt) => {
    if (!evt.target.matches('.tooltipWrap') && currentTooltipRef.current) {
      currentTooltipRef.current.style.display = 'none';
    }
  };

  const showCurrentTooltip = () => {
    const allTooltips = [...document.getElementsByClassName('tooltipWrap')];
    allTooltips.forEach((t) => ((t as HTMLDivElement).style.display = 'none'));
    currentTooltipRef.current.style.display = 'block';
  };

  const removeTooltipOnMouseleave = () => {
    currentTooltipRef.current.style.display = 'none';
  };

  return (
    <div
      className="tooltipHost"
      onClick={() => onClick && showCurrentTooltip()}
      onMouseEnter={() => onHover && showCurrentTooltip()}
      onMouseLeave={() => onHover && removeTooltipOnMouseleave()}
    >
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
