import React from 'react';
import { Redirect } from 'react-router-dom';

import Form from './create/Form';
import GoogleApiWrapper from '../map/SimpleMap';

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.loadSportType = this.loadSportType.bind(this);
  }

  state = {
    sportTypes: [],
    redirect: false,
    newEvent: {
      name: '',
      image_url: '',
      lng: 0.0,
      lat: 0.0,
      description: '',
      start_time: '',
      end_time: '',
      period: 0,
      price: '',
      age_from: '',
      age_to: '',
      members_total: '',
      members_needed: '',
      sport_id: 1,
      event_status_id: 1,
      card_number: '',
    },
    fields: {
      isAgeDisable: false,
      isPriceDisable: false,
    },
  };

  componentDidMount() {
    this.loadSportType();
  }

  handleInputChange = (event) => {
    const { newEvent } = this.state;
    let value = event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value;
    if (event.target.type === 'datetime-local') {
      value = new Date(value).toISOString().slice(0, 16);
    }
    this.setState({
      newEvent: {
        ...newEvent,
        [event.target.id]: value,
      },
    });
  };

  handleFileChange = (image) => {
    this.setState({
      image,
    }, () => {
      console.log(this.state);
      this.handleUploadImage();
    });
  }

  handleSelectChange = (event) => {
    const { newEvent } = this.state;
    this.setState({
      newEvent: {
        ...newEvent,
        [event.target.id]: parseInt(event.target.value, 10),
      },
    });
  };

  handleAnyAgeChange = (event) => {
    const { newEvent, fields } = this.state;
    if (event.target.checked) {
      this.setState({
        newEvent: {
          ...newEvent,
          age_from: 1,
          age_to: 100,
        },
        fields: {
          ...fields,
          isAgeDisable: !fields.isAgeDisable,
        },
      });
    } else {
      this.setState({
        fields: {
          ...fields,
          isAgeDisable: !fields.isAgeDisable,
        },
      });
    }
  };

  handleFreeChange = (event) => {
    const { newEvent, fields } = this.state;
    if (event.target.checked) {
      this.setState(prevState => ({
        newEvent: {
          ...newEvent,
          price: 0,
        },
        fields: {
          ...fields,
          isPriceDisable: !prevState.fields.isPriceDisable,
        },
      }));
    } else {
      this.setState(prevState => ({
        fields: {
          ...fields,
          isPriceDisable: !prevState.fields.isPriceDisable,
        },
      }));
    }
  };

  handleCancel = () => {
    this.setState({
      redirectToIndex: true,
    });
  };

  setInitialMarkerPosition = (lat, lng) => {
    const { newEvent } = this.state;
    this.setState({
      newEvent: {
        ...newEvent,
        lng: Number(lng.toFixed(6)),
        lat: Number(lat.toFixed(6)),
      },
    });
  }

  handleMarkerDragend = (mapProps, map) => {
    const { newEvent } = this.state;
    this.setState({
      newEvent: {
        ...newEvent,
        lng: Number(map.position.lng().toFixed(6)),
        lat: Number(map.position.lat().toFixed(6)),
      },
    });
  };

  validate = () => {
    let isValid = true;
    const errors = [];

    const { newEvent } = this.state;

    if (newEvent.name.length < 3) {
      isValid = false;
      errors.push('Event name should contain at least 3 character!');
    }

    const startTime = new Date(newEvent.start_time);
    const endTime = new Date(newEvent.end_time);
    const now = new Date();

    if (startTime.toString() === 'Invalid Date' || endTime.toString() === 'Invalid Date') {
      isValid = false;
      errors.push('Invalid date, check dates!');
    }

    // validate time
    if (endTime <= startTime || endTime <= now || startTime <= now) {
      isValid = false;
      errors.push('Please, check dates!');
    }
    // validate age
    if (
      newEvent.age_from < 1
      || newEvent.age_from > 100
      || newEvent.age_to < 1
      || newEvent.age_to > 100
    ) {
      isValid = false;
      errors.push('Age should be more than 1 and less than 100!');
    }
    // validate price
    if (newEvent.price < 0 || newEvent.price > 100000) {
      isValid = false;
      errors.push('Price should be more than 0 and less than 100000!');
    }
    // validate card number
    if (newEvent.card_number.length !== 16 && newEvent.card_number.length !== 0) {
      isValid = false;
      errors.push('Please, pay attention to your card number!');
    }
    // validate description
    if (newEvent.description.length > 1000) {
      isValid = false;
      errors.push('Description should be shorter than 1000 character!');
    }
    // validate members
    if (
      newEvent.members_total <= newEvent.members_needed
      || newEvent.members_total <= 0
      || newEvent.members_needed <= 0
    ) {
      isValid = false;
      errors.push('Total numbers of members should be at list 2!');
      errors.push('Total numbers of members should be more than you need!');
    }

    if (!isValid) {
      alert(errors.join('\n'));
    }
    return isValid;
  };

  async loadSportType() {
    const response = await fetch('http://localhost:5999/sports');
    const data = await response.json();
    await this.setState({
      sportTypes: data,
    });
  }

  async handleSubmit() {
    if (this.validate()) {
      const { newEvent: obj } = this.state;
      const response = await fetch('http://localhost:5999/events', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(obj),
      });
      const message = await response.json();
      // await console.log(message);

      if (message.code === 201) {
        this.setState({
          redirect: true,
          id: message.id,
        });
      } else {
        alert('We\'re so sorry!');
      }
    }
  }

  async handleUploadImage() {
    const { image, newEvent } = this.state;
    const data = new FormData();
    data.append('image', image);
    const response = await fetch('http://localhost:5999/upload_image', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: data,
    });
    const message = await response.json();
    console.log(message.url);
    this.setState({
      newEvent: {
        ...newEvent,
        image_url: message.url,
      },
    }, () => {
      console.log(this.state);
    });
  }

  render() {
    const {
      sportTypes, newEvent, fields, redirect, id, redirectToIndex,
    } = this.state;

    if (redirect) {
      return <Redirect to={`/event/${id}`} />;
    }

    if (redirectToIndex) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <div className="container my-3">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-12 col-sm-12 col-12">
              <Form
                sportTypes={sportTypes}
                newEvent={newEvent}
                fields={fields}
                handleAnyAgeChange={this.handleAnyAgeChange}
                handleCancel={this.handleCancel}
                handleFreeChange={this.handleFreeChange}
                handleInputChange={this.handleInputChange}
                handleSelectChange={this.handleSelectChange}
                handleSubmit={this.handleSubmit}
                handleFileChange={this.handleFileChange}
              />
            </div>
            <div className="col-xl-8 col-lg-7 col-md-12 col-sm-12 col-12">
              <GoogleApiWrapper
                setInitialMarkerPosition={this.setInitialMarkerPosition}
                handleMarkerDragend={this.handleMarkerDragend}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateEvent;
