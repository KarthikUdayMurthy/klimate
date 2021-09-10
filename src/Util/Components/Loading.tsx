import * as React from 'react';

interface LoadingProps {
  loadPct?: number;
}

const Loading: React.FC<LoadingProps> = ({ loadPct }) => {
  let loadWidth = loadPct || 0;
  let loadWidthStyle = {};
  if (loadWidth) {
    loadWidthStyle = { width: loadWidth + '%' };
  }
  return (
    <div className="loader loaderShow">
      <div className="loaderContent">
        <div className="spinner w3-spin" />
        {loadPct && (
          <div className="progressBar">
            <div className="progressPct" style={loadWidthStyle} />
          </div>
        )}
        {loadPct && <div className="progressText">{loadWidth + '%'}</div>}
      </div>
    </div>
  );
};

export { Loading };
