import React from 'react';
import { fakeData } from '../map/fakeData';
import FiltersForm from './filters-form';
import GoogleApiWrapper from '../map/Map';
import EventSidebar from './event-sidebar/EventSidebar';
import './Main.css'

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: 'http://localhost:5999/',
      locations: fakeData,
      selectedMarker: null,
      selectedFilters: {

      },
      mapBounds: {
        north: '',
        south: '',
        east: '',
        west: '',
      },
      // eventSideBarVisible: true,
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // to avoid unnecessary re-render
  //   const { locations } = this.state;
  //   return nextState.locations !== locations;
  // }

  handleMarkerClick = (markerId) => {
    // handler for event onMarkerClick on the MAP
    this.setState({ selectedMarker: markerId });
    // this.setState((prevState) => ({ eventSideBarVisible: !prevState.eventSideBarVisible }));
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
    console.log(this.state.mapBounds);
  };

  async loadLocationsForMap() {
    // get locations for map that looks like {id: 1, lat: 50.11, lng: 30.11, sport_type_id: 1}
    const { domain } = this.state;
    const response = await fetch(`${domain}/get-locations`);
    const locations = await response.json();
    this.setState({
      locations,
    });
  }

  render() {
    const { locations, eventSideBarVisible } = this.state;
    // let eventsidebar;

    // if (eventSideBarVisible) {
    //   eventsidebar = <EventSidebar />
    // } 

    return (
      <div className="mainPage">
        <FiltersForm />
        <div className="body">
          <div className="eventSideBar">
            <EventSidebar selectedMarker = {this.state.selectedMarker}/>
            {/* {eventsidebar} */}
          </div>
          <div className="mapWrapper">
            <GoogleApiWrapper              
              handleBoundsChanged={this.handleBoundsChanged}
              handleMarkerClick={this.handleMarkerClick}
              locations={locations}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
