import React from 'react';

import { fakeData } from '../map/fakeData';
import FiltersForm from './filters-form';
import GoogleApiWrapper from '../map/Map';
import EventSidebar from './event-sidebar/EventSidebar';

import './Main.css';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: 'http://localhost:5999/',
      locations: fakeData,
      selectedMarker: null,
      selectedFilters: {},
      mapBounds: {
        north: '',
        south: '',
        east: '',
        west: '',
      },
    };
  }

  handleMarkerClick = (markerId) => {
    // handler for event onMarkerClick on the MAP
    this.setState({ selectedMarker: markerId });
    console.log(this.state);
  };

  handleBoundsChanged = (north, south, east, west) => {
    // handler for 'zoom_changed' and 'dragend'
    // load current map bounds to state
    this.setState({
      mapBounds: {
        north,
        south,
        east,
        west,
      },
    });
    const { mapBounds } = this.state;
    console.log(mapBounds);
  };

  render() {
    return (
      <div className="mainPage">
        <FiltersForm />
        <div className="body">
          <div className="eventSideBar">
            <EventSidebar />
          </div>
          <div className="mapWrapper">
            <GoogleApiWrapper
              handleBoundsChanged={this.handleBoundsChanged}
              handleMarkerClick={this.handleMarkerClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
