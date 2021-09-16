import * as React from 'react';
import { Loading, TabMenu, ITabMenuItem } from '../Util/Components';
import apiHelper, { FetchDataParams } from '../Util/apiHelper';
import { addSwipeListeners, removeSwipeListeners } from '../Util/swipeDetect';
import dataModifier from '../Util/dataModifier';
import {
  DataHistoryWidget,
  CurrentWeatherWidget,
  TomorrowWeatherWidget,
  DailyWeatherWidget,
} from './widgets';
import { IOneCall, IUserData } from '../Models';

interface HomeProps {
  userData: IUserData;
  onLogout: () => void;
  tourMode: boolean;
}
interface HomeState {
  apiData: IOneCall | null;
  loading: boolean;
  apiError: string;
  OneCallEndPoint: string;
  menuItems: ITabMenuItem[];
  selectedMenuIndex: number;
  previousMenuIndex: number;
  isSwiped: boolean;
}

export default class Home extends React.Component<HomeProps, HomeState> {
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      loading: true,
      apiError: '',
      OneCallEndPoint: 'OneCall',
      menuItems: [],
      selectedMenuIndex: 0,
      previousMenuIndex: 0,
      isSwiped: false,
    };
    this.fetchOneCallData = this.fetchOneCallData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.menuItemChange = this.menuItemChange.bind(this);
  }

  componentDidMount() {
    addSwipeListeners(
      () => {
        this.menuItemChange(this.state.selectedMenuIndex - 1, true);
      },
      () => {
        this.menuItemChange(this.state.selectedMenuIndex + 1, true);
      },
      '.HourlyWeatherWidget'
    );
    this.fetchOneCallData();
    this.setState({
      menuItems: [
        {
          text: 'Today',
          onClick: () => this.menuItemChange(0),
          isSelected: this.state.selectedMenuIndex === 0,
          icon: 'fas fa-calendar',
        },
        {
          text: 'Tomorrow',
          onClick: () => this.menuItemChange(1),
          isSelected: this.state.selectedMenuIndex === 1,
          icon: 'fas fa-calendar-day',
        },
        {
          text: '8 Days',
          onClick: () => this.menuItemChange(2),
          isSelected: this.state.selectedMenuIndex === 2,
          icon: 'fas fa-calendar-alt',
        },
      ],
    });
  }

  componentWillUnmount() {
    removeSwipeListeners();
  }

  fetchOneCallData() {
    let { tourMode, userData } = this.props;
    if (userData) {
      var { lat, long: lon, apiKey: appid } = userData;
    }
    let { OneCallEndPoint } = this.state;
    let params: FetchDataParams = {
      endPoint: OneCallEndPoint,
      cacheKey: OneCallEndPoint + '00',
    };
    if (tourMode) {
      params.isMock = true;
    } else {
      params.cacheKey = OneCallEndPoint + lat.toString() + lon.toString();
      params.isMock = false;
      params.queryParams = {
        lat,
        lon,
        units: 'metric',
        exclude: 'minutely',
        appid,
      };
    }
    apiHelper
      .fetchData<IOneCall>(params)
      .then((res) => {
        this.setState({
          apiData: dataModifier(res),
          loading: false,
          apiError: '',
        });
      })
      .catch((e) => {
        this.setState({
          apiData: null,
          loading: false,
          apiError: e.message,
        });
      });
  }

  refreshData() {
    apiHelper.clearCache(this.state.OneCallEndPoint);
    this.fetchOneCallData();
  }

  menuItemChange(menuItemIndex: number, isSwiped: boolean = false) {
    if (menuItemIndex > 2) {
      menuItemIndex = 2;
    } else if (menuItemIndex < 0) {
      menuItemIndex = 0;
    }
    this.setState({
      menuItems: this.state.menuItems.map((menuItem, ind) => {
        menuItem.isSelected = menuItemIndex === ind;
        return menuItem;
      }),
      previousMenuIndex: this.state.selectedMenuIndex,
      selectedMenuIndex: menuItemIndex,
      isSwiped: isSwiped,
    });
  }

  render() {
    let { tourMode, userData, onLogout } = this.props;
    let { loading, apiData, apiError } = this.state;

    if (loading) {
      return <Loading />;
    }
    if (apiError) {
      return (
        <div>
          {apiError}
          <button className="iBtnSecondary w3-block" onClick={onLogout}>
            {tourMode ? 'End Tour' : 'Logout'}
          </button>
        </div>
      );
    }
    if (apiData) {
      return (
        <div className="homeWrap">
          {!tourMode && (
            <DataHistoryWidget
              dataTimeStamp={apiData.current.dt}
              OnRefreshData={this.refreshData}
            />
          )}
          <TabMenu menuItems={this.state.menuItems} />
          {this.state.selectedMenuIndex === 0 && (
            <CurrentWeatherWidget
              data={apiData.current}
              hourlyWeatherdata={apiData.hourly}
              isSwiped={this.state.isSwiped}
            />
          )}
          {this.state.selectedMenuIndex === 1 && (
            <TomorrowWeatherWidget
              data={apiData.daily[1]}
              previousMenuIndex={this.state.previousMenuIndex}
              isSwiped={this.state.isSwiped}
            />
          )}
          {this.state.selectedMenuIndex === 2 && (
            <DailyWeatherWidget
              data={apiData.daily}
              isSwiped={this.state.isSwiped}
            />
          )}
          <button
            className="iBtnSecondary w3-block"
            onClick={onLogout}
            style={{ marginBottom: 0 }}
          >
            {tourMode ? 'End Tour' : 'Logout'}
          </button>
        </div>
      );
    }
    return <React.Fragment />;
  }
}
