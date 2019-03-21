import React from 'react';
import PropTypes from 'prop-types';
import { Map as GoogleMap, GoogleApiWrapper, Marker } from 'google-maps-react';

export class SimpleMap extends React.Component {
  constructor(props) {
    super(props);
    const { markerPosition } = this.props;

    this.state = {
      markerPosition,
    };
  }

  getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.setState({
            markerPosition: location,
          });
        },
        () => {
          //  error callback
          console.log('Oh! Somethings happened!');
        },
      );
    } else {
      // Browser doesn't support Geolocation
      console.log('Oh! Your browser does not support geolocation!');
    }
  };

  render() {
    const { google, handleMarkerDragend } = this.props;
    const { markerPosition } = this.state;

    return (
      <GoogleMap
        google={google}
        streetViewControl={false}
        mapTypeControl={false}
        zoom={15}
        onReady={() => this.getCurrentLocation()}
        centerAroundCurrentLocation
      >
        <Marker onDragend={handleMarkerDragend} draggable position={markerPosition} />
      </GoogleMap>
    );
  }
}

SimpleMap.defaultProps = {
  markerPosition: { lat: 0, lng: 0 },
  handleMarkerDragend: undefined,
};

SimpleMap.propTypes = {
  google: PropTypes.instanceOf(Object).isRequired,
  markerPosition: PropTypes.instanceOf(Object),
  handleMarkerDragend: PropTypes.func,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDqP6ssmZfq_A7htoIJ8gsWuJDN6OwaZLE',
})(SimpleMap);
