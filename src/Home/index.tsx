import * as React from 'react';
import { Loading, TabMenu, ITabMenuItem } from '../Util/Components';
import apiHelper, { FetchDataParams } from '../Util/apiHelper';
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
  _xDown = null;
  _yDown = null;
  _excludeSelectors = '.HourlyWeatherWidget';

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
    this.addSwipeListeners = this.addSwipeListeners.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  componentDidMount() {
    this.addSwipeListeners();
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
    const rootDiv = document.getElementById('root');
    rootDiv.removeEventListener('touchstart', this.handleTouchStart, false);
    rootDiv.removeEventListener('touchmove', this.handleTouchMove, false);
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

  addSwipeListeners() {
    const rootDiv = document.getElementById('root');
    rootDiv.addEventListener('touchstart', this.handleTouchStart, false);
    rootDiv.addEventListener('touchmove', this.handleTouchMove, false);
  }

  handleTouchStart(evt) {
    if (evt.target.closest(this._excludeSelectors)) {
      return;
    }
    const getTouches = (evt: TouchEvent) => {
      return evt.touches;
    };
    const firstTouch = getTouches(evt)[0];
    this._xDown = firstTouch.clientX;
    this._yDown = firstTouch.clientY;
  }

  handleTouchMove(evt) {
    if (!this._xDown || !this._yDown) {
      return;
    }

    if (evt.target.closest(this._excludeSelectors)) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = this._xDown - xUp;
    let yDiff = this._yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* right swipe */
        this.menuItemChange(this.state.selectedMenuIndex + 1, true);
      } else {
        /* left swipe */
        this.menuItemChange(this.state.selectedMenuIndex - 1, true);
      }
    } else {
      if (yDiff > 0) {
        /* down swipe */
      } else {
        /* up swipe */
      }
    }
    this._xDown = null;
    this._yDown = null;
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
