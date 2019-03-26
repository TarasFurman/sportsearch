import React from 'react';
import Event from './Event/index'
import {connect} from 'react-redux';
import './eventSideBar.css';

function EventSidebar(props) {
  const events = props.events

  const eventsList = events.map((event) =>
    <Event
      id={event.id}
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
  return (
    <div className="eventBar">
      {eventsList}
    </div>
  )
}

const mapStateToProps = (state) =>
{
    return {events : state.events};
};

export default (connect(mapStateToProps)(EventSidebar));
