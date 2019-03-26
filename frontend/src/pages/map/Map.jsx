import React from 'react';
import PropTypes from 'prop-types';
import { Map as GoogleMap, GoogleApiWrapper } from 'google-maps-react';
import MarkerClusterer from '@google/markerclusterer';
import { connect } from 'react-redux';
import './index.css';
export class Map extends React.Component {
  constructor(props) {
    super(props);

    // set default options, style for map
    this.state = {
      defaultMapOptions: {
        streetViewControl: false,
        mapTypeControl: false,
        zoom: 12,
        minZoom: 10,
        maxZoom: 17,
      },
      mapStyle: {
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
          },
        ],
      },
    };
  }

  getCurrentBounds = (map) => {
    const { handleBoundsChanged } = this.props;
    const north = map
      .getBounds()
      .getNorthEast()
      .lat();
    const south = map
      .getBounds()
      .getSouthWest()
      .lat();

    const east = map
      .getBounds()
      .getNorthEast()
      .lng();
    const west = map
      .getBounds()
      .getSouthWest()
      .lng();
    handleBoundsChanged(north, south, east, west);
  };

  initSearchBox = (google, map) => {
    // initialization search box on the map
    // google - a reference to the googleAPIObjects object
    // map - the Google instance of the map
    const searchBox = new google.maps.places.SearchBox(this.searchInput);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchInput);

    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  };

  shouldComponentUpdate() {
    return true;
  }

  getCurrentLocation = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(location);
          // this.getCurrentBounds(map);
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

  handleReady = (mapProps, map) => {
    // set up map options (listeners, styles)
    console.log('onReady');
    const { mapStyle } = this.state;
    const { google } = this.props;
    google.maps.event.addListener(map, 'zoom_changed', () => {
      // this.getCurrentBounds(map);
    });

    google.maps.event.addListener(map, 'dragend', () => {
      // this.getCurrentBounds(map);
    });

    // searchBox initialization
    this.initSearchBox(google, map);

    map.setOptions(mapStyle);

    // add markers to the map
    const markers = this.generateMarkersFromListOfSportEvents();

    this.markerClusterer = new MarkerClusterer(map, markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });

    // set center of the map to current location
    this.getCurrentLocation(map);
  };

  generateMarkersFromListOfSportEvents = () => {
    const { google, handleMarkerClick, events } = this.props;
    // add markers to the map
    const markers = events.map((event, index) => {
      const marker = new google.maps.Marker({
        position: { lat: event.y_coord, lng: event.x_coord },
        label: event.sport_type,
        title: event.name,
        animation: google.maps.Animation.DROP,
        id: index,
      });
      marker.addListener('click', () => handleMarkerClick(marker.id));
      return marker;
    });

    return markers;
  };

  updateMarkersOnMap = () => {
    if (this.markerClusterer !== undefined) {
      const markers = this.generateMarkersFromListOfSportEvents();
      this.markerClusterer.clearMarkers();
      this.markerClusterer.addMarkers(markers);
    }
  };

  render() {
    console.log('render');
    const { google } = this.props;
    const { defaultMapOptions } = this.state;
    this.updateMarkersOnMap();
    return (
      <React.Fragment>
        <GoogleMap google={google} {...defaultMapOptions} onReady={this.handleReady} />
        <input
          id="search-box"
          className="search-txt"
          type="text"
          ref={(c) => {
            this.searchInput = c;
          }}
          placeholder="Search box"
        />
      </React.Fragment>
    );
  }
}

Map.propTypes = {
  google: PropTypes.instanceOf(Object).isRequired,
  locations: PropTypes.instanceOf(Array).isRequired,
  handleMarkerClick: PropTypes.func.isRequired,
  handleBoundsChanged: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ events: state.events });

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDqP6ssmZfq_A7htoIJ8gsWuJDN6OwaZLE',
  libraries: ['places'],
})(connect(mapStateToProps)(Map));
