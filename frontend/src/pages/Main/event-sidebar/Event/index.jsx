import React from 'react';
import { Image } from 'react-bootstrap';
import { MdLocationOn } from 'react-icons/md';
import { GiAmericanFootballBall } from 'react-icons/gi';
import { FaDollarSign, FaClock } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { FaAngleDown, FaAngleUp, FaInfoCircle, FaUserCircle, FaStar} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import './index.css';
import AnotherUserProfileCard from '../../../another-user-profile/another-user-profile-card';

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAllInfo: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isAllInfo: !prevState.isAllInfo,
    }));
    console.log(this.state);
  }

  handleApply() {
    fetch(`http://localhost:5999/apply-for-event/${this.props.id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => alert(response.error.description));
  }

  render() {
    let fullDescription; let fullOwner; let fullRating; let randCol; let
      buttonDownUp;

    if (this.state.isAllInfo) {
      fullDescription = (
        <div className="fullDescription partDescription">
          <span className=""><FaInfoCircle />{' '}{this.props.description}</span>
        </div>
      );
      fullOwner = (
        <div className="fullOwner partDescription">
        <FaUserCircle />
          <AnotherUserProfileCard userId={this.props.owner_id}>
            <span className="fullOwnerSpan ">{' '}{this.props.owner}</span>
          </AnotherUserProfileCard>
        </div>
      );
      fullRating = (
        <span className="fullRatingSpan partDescription"><FaStar />{' '}{this.props.owner_rating}</span>
      );

      buttonDownUp = <FaAngleUp className="arrowBtn" onClick={this.handleClick} />;
    } else {
      buttonDownUp = <FaAngleDown className="arrowBtn" onClick={this.handleClick} />;
    }
    return (
      <IconContext.Provider value={{ className: 'global-svg-icon-class' }}>
        <div className="eventWrapper">
          <div className="eventName">
            <h2 className="eventTitle">{this.props.name}</h2>
          </div>
          <div className="mainEventInfo">
            <Image src={this.props.img_url} thumbnail className="d-block" />
            <div className="rightPart">
              <div className="center">
                <span><GiAmericanFootballBall /></span>
                <span><FaDollarSign /></span>
                <span><IoIosPeople /></span>
              </div>
              <div className="center">
                <span className="priceSpan">{this.props.sport_type}</span>
                <span className="priceSpan">{this.props.price}</span>
                <span className="membersSpan">{this.props.members}{' '}of{' '}{this.props.members_total}</span>
              </div>
            </div>
          </div>
          <div className="partDescription">
            <span className="dateSpan"><FaClock />{' '}{this.props.datetime}</span>
          </div>
          <div className="partDescription">
            <span className="addressSpan"><MdLocationOn />{' '}{this.props.adress}</span>
          </div>
          {fullOwner}
          {fullRating}
          {fullDescription}

          <button className="applyButton" onClick={this.handleApply}>
            Apply
          </button>
        

          <a href="#container">
            <div id="arrow-down">{buttonDownUp}</div>
          </a>
        
         </div>
      </IconContext.Provider>
    );
  }
}

export default Event;
