import * as React from 'react';
import {IUserData} from '../Models';
import {getLocation} from '../Util/util';
import {Input, Loading} from '../Util/Components';

interface LoginProps { 
  userData: IUserData;
  onLogin: (userData: IUserData, rememberMe: boolean) => void;
  startTour: () => void;
}
interface LoginState {
  apiKey: string;
  lat: number;
  long: number;
  rememberMe: boolean;
  error: string;
  loading: boolean;
}

export default class Login extends React.Component<LoginProps, LoginState> {
  private _isMounted: boolean = false;

  constructor(props) {
    super(props);
    let userData = this.props.userData;
    this.state = {
      apiKey: userData?.apiKey || "",
      lat: userData?.lat || 0,
      long: userData?.long || 0,
      rememberMe: !!userData,
      error: "",
      loading: false      
    };

    this._isMounted = false;

    this.onSubmit = this.onSubmit.bind(this);
    this.fetchAndSetLocation = this.fetchAndSetLocation.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
      if(!this.props.userData) {
        this.fetchAndSetLocation();
      }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async fetchAndSetLocation() {
    this.setState({
      lat: 0,
      long: 0,
      loading: true
    });
    try {
      let locCoords = await getLocation();
        setTimeout(()=>{
          this._isMounted && this.setState({
            lat: locCoords.lat,
            long: locCoords.long,
            loading: false
          });
        }, 1000);
    } catch(e) {
      this.setState({ loading: false });
    }
  }

  onSubmit() {
    event.preventDefault();
    this.setState({ loading: true });
    let {apiKey, lat, long} = this.state;

    if(apiKey.toString().trim() === "") {
      this.setState({error: "API Key cannot be blank", loading: false});
    } else if(!lat || !long) {
      this.setState({error: "Latitude and Longitude cannot be blank", loading: false});
    } else if (isNaN(lat) || isNaN(long)) {
      this.setState({error: "Latitude and Longitude should be numbers", loading: false});
    } else {
      this.setState({error: "", loading: true});

      apiKey = apiKey.toString().trim();
      lat = Number(lat);
      long = Number(long);

      let userData: IUserData = {
        apiKey,
        lat,
        long
      }
      this.props.onLogin(userData, this.state.rememberMe);
    }
  }

  render() {
    return (
      <div className="loginWrap">
        {this.state.loading && <Loading />}
        <h1><i className="fas fa-bolt"></i> <br/> Klimate</h1>
        <form onSubmit={this.onSubmit}>
          <Input label="API Key" type="password"  value={this.state.apiKey} onChangeHandler={(e) => {this.setState({apiKey: e.target.value})}} required={true} />
          <div className="locWrap">
            <div className="fieldPart">              
              <Input label="Latitude" type="number"  value={this.state.lat} onChangeHandler={(e) => {this.setState({lat: e.target.value})}} required={true} />
              <Input label="Longitude" type="number"  value={this.state.long} onChangeHandler={(e) => {this.setState({long: e.target.value})}} required={true} />
            </div>
            <div className="iconPart">              
                <button type="button" onClick={this.fetchAndSetLocation} className="iBtnSecondary" title="Get Current Location" ><i className="fas fa-map-marker-alt"></i> <br/> <span className="w3-small">Get<br/>Location</span></button>
            </div>
          </div>
          <Input label="Remember Me" type="checkbox"  value={this.state.rememberMe} onChangeHandler={(e) => {this.setState({rememberMe: e.target.checked})}} required={true} />
          <input type="submit" value="Show Weather" className="iBtnPrimary w3-block" />
          {this.state.error && <div className="errDiv w3-pale-red w3-text-red w3-animate-opacity"><i className="fas fa-exclamation-circle"></i> {this.state.error}</div>}
        </form>
        <button type="button" className="iBtnSecondary w3-display-topright tourBtn"><i className="fas fa-plane"></i><span className="w3-animate-opacity" onClick={this.props.startTour}>&nbsp;Tour</span></button>
      </div>
    );
  }
}