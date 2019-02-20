import React from 'react';
import { Map as GMap, Marker, GoogleApiWrapper } from 'google-maps-react';
 
export class Map extends React.Component {
  constructor(props) {
    super(props);
    this.onMarkerClick = () => {
      alert('Click me');
    }
    this.state = {
      lat: 50,
      lng: 40
    };
  }

  async componentWillMount() {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, () => {
        console.log('error');
      });
    }
  }

  async componentDidMount() {
    const url = 'https://swapi.co/api/people/1';
    const response = await fetch(url);
    const data = await response.json()
    console.log(data)
  }

  render() {
    return (
      <GMap google={this.props.google} 
            zoom={15}
            center={{
              lat: this.state.lat, 
              lng: this.state.lng
            }}
            style={{height: '90%'}}
      >
        <Marker position={this.state} onClick={this.onMarkerClick} />
      </GMap>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyDqP6ssmZfq_A7htoIJ8gsWuJDN6OwaZLE')
})(Map);
