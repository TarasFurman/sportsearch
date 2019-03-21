const eventsRequested = () => {
    return {
      type: 'FETCH_EVENTS_REQUEST'
    }
  };
  
  const eventsLoaded = (newEvents) => {
    return {
      type: 'FETCH_EVENTS_SUCCESS',
      payload: newEvents
    };
  };
  
  const eventsError = (error) => {
    return {
      type: 'FETCH_EVENTS_FAILURE',
      payload: error
    };
  };

const fetchEvents = (sportSearchService,  dispatch) => () => {

    dispatch(eventsRequested());

    sportSearchService.getEvents()
      .then((response) => dispatch(eventsLoaded(response.data.events)))
      .catch((err) => dispatch(eventsError(err)));
};
  export {
    fetchEvents
  };