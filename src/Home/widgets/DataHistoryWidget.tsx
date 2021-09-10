import * as React from 'react';
import { getDateFromTimestamp } from '../../Util/util';

export interface DataHistoryWidgetProps {
  dataTimeStamp: number;
  OnRefreshData: () => void;
}

const DataHistoryWidget: React.FC<DataHistoryWidgetProps> = ({
  dataTimeStamp,
  OnRefreshData
}) => {
  return (
    <div className="DataHistoryWidget">
      <span className="fontS">
        Data fetched {getDateFromTimestamp(dataTimeStamp, true)} &nbsp;
      </span>
      <button className="iBtnSecondary" onClick={OnRefreshData}>
        <i className="fas fa-sync-alt" />
      </button>
    </div>
  );
};

export { DataHistoryWidget };
