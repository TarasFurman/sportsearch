const initialState = {
  events: [],
  loading: true,
  error: null,
  newEvent: {
    name: '',
    image_url: 'https://img.icons8.com/color/96/000000/today.png',
    x_coord: 30.519837,
    y_coord: 50.4475854,
    start_time: '',
    end_time: '',
    period: 0,
    price: '',
    age_from: '',
    age_to: '',
    members_total: '',
    members_needed: '',
    sport_id: '',
    owner_id: 1,
    event_status_id: 1,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS_REQUEST':
      return {
        ...state,
        events: [],
        loading: true,
        error: null,
      };

    case 'FETCH_EVENTS_SUCCESS':
      return {
        ...state,
        events: action.payload,
        loading: false,
        error: null,
      };

    case 'FETCH_EVENTS_FAILURE':
      return {
        ...state,
        events: [],
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
