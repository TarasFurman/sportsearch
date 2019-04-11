import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import {Button} from "react-bootstrap";

class ProfilePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false
    };
    this.closePopup = this.closePopup.bind(this);
  };

  closePopup() {
    this.props.closePopup();
  }

  render() {
    return (
      <div className="popup">
        <div className='popup_inner'>
          <p>Go to your new email to confirm Your email changing.</p>
          <Button onClick={this.closePopup}>Ok!</Button>
      </div>
    </div>
    );
  }
}

export default ProfilePopup;
