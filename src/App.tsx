import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import { IUserData } from './Models';
import {
  getLocalUserData,
  setLocalUserData,
  clearLocalUserData
} from './Util/util';

interface AppProps {}
interface AppState {
  isLoggedIn: boolean;
  userData?: IUserData;
  tourMode: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      tourMode: false
    };
    this.checkAndSetLocalData = this.checkAndSetLocalData.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.startTour = this.startTour.bind(this);
  }

  componentDidMount() {
    let isLocalDataPresent = this.checkAndSetLocalData();
    if (isLocalDataPresent) {
      this.setState({
        isLoggedIn: true
      });
    }
  }

  checkAndSetLocalData() {
    var localUserData = getLocalUserData();
    if (localUserData) {
      this.setState({
        userData: localUserData
      });
    }
    return !!localUserData;
  }

  loginHandler(userData: IUserData, rememberMe: boolean): void {
    this.setState({
      isLoggedIn: true,
      userData,
      tourMode: false
    });
    if (rememberMe) {
      setLocalUserData(userData);
    } else {
      clearLocalUserData();
    }
  }

  logoutHandler(): void {
    this.setState({
      isLoggedIn: false,
      userData: null,
      tourMode: false
    });
    this.checkAndSetLocalData();
  }

  startTour(): void {
    this.setState({ tourMode: true });
  }

  render() {
    return (
      <div className="appWrap">
        <div className="view">
          <Router>
            <Switch>
              <Route path="/home">
                {this.state.isLoggedIn || this.state.tourMode ? (
                  <Home
                    userData={this.state.userData}
                    onLogout={this.logoutHandler}
                    tourMode={this.state.tourMode}
                  />
                ) : (
                  <Login
                    userData={this.state.userData}
                    onLogin={this.loginHandler}
                    startTour={this.startTour}
                  />
                )}
              </Route>
              <Route path="/">
                <Redirect to="/home" />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}
