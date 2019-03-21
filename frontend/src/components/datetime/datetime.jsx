import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import "./datetime.css"

class DatePickers extends Component {
  state = {
    date: new Date(),
  }
 
  onChange = (date) =>
  { 
    this.setState({ date })
    this.props.onChange(Math.ceil(date.getTime() / 1000))
  }
 
  render() {
    return (
      <div>
      {this.props.label}
        <DateTimePicker
          className="date-time"
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}

export default DatePickers;