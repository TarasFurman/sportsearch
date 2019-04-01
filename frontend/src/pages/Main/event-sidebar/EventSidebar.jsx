import React from 'react';
import Event from './Event/index'
import {connect} from 'react-redux';
import './eventSideBar.css';

function EventSidebar(props) {
  const events = props.events
  const selectedMarker = props.selectedMarker


  let selectedEvent = events.selectedMarker
  
  if(selectedMarker){
    selectedEvent =  <Event 
      id={selectedMarker}
      img_url= {events[selectedMarker].image_url}
      name = {events[selectedMarker].name}
      sport_type = {events[selectedMarker].sport_type}
      price = {events[selectedMarker].price}
      adress= {events[selectedMarker].address}
      datetime= {events[selectedMarker].start_time}
      members = {events[selectedMarker].members_needed}
      members_total = {events[selectedMarker].members_total}
      owner = {events[selectedMarker].owner}
      owner_rating = {events[selectedMarker].owner_rating}
      owner_id = {events[selectedMarker].owner_id}
      description = {events[selectedMarker].description} />
  }

  const eventsList = events.map((event) =>
    <Event
      id={event.id}
      key={event.id}
      img_url= {event.image_url}
      name = {event.name}
      sport_type = {event.sport_type}
      price = {event.price}
      adress= {event.address}
      datetime= {event.start_time}
      members = {event.members_needed}
      members_total = {event.members_total}
      owner = {event.owner}
      owner_rating = {event.owner_rating}
      owner_id = {event.owner_id}
      description = {event.description}
    />
  );

  if(selectedMarker){
    return <div className="eventBar">
      {selectedEvent}
    </div>
  } else {
    return (
      <div className="eventBar">
        {eventsList}
      </div>
    )
  }
  
}

const mapStateToProps = (state) =>
{
    return {events : state.events};
};

export default (connect(mapStateToProps)(EventSidebar));
