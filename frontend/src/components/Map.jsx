import React from 'react';
import { Map as GMap, Marker, GoogleApiWrapper } from 'google-maps-react';
 
export class Map extends React.Component {
  constructor(props) {
    super(props);
    this.onMarkerClick = () => {
      alert('Click me');
    }

    this.onMouseover = () => {
      console.log('Hover me')
    }
  }

  render() {
    return (
      <GMap google={this.props.google} zoom={15}>
        <Marker onClick={this.onMarkerClick} onMouseover={this.onMouseover}
                name={'Current location'} />
      </GMap>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyDqP6ssmZfq_A7htoIJ8gsWuJDN6OwaZLE')
})(Map);
