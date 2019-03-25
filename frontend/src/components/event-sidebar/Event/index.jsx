import React from 'react';
import { Image } from 'react-bootstrap';
import { MdLocationOn } from 'react-icons/md';
import { GiAmericanFootballBall } from 'react-icons/gi';
import { FaDollarSign, FaClock } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import {
  FaAngleDown, FaAngleUp, FaInfoCircle, FaUserCircle, FaStar,
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { randomColorClass } from '../eventCardColors.js';

import './index.css';
import AnotherUserProfileCard from '../../another-user-profile/another-user-profile-card';

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAllInfo: false,
      randCol: randomColorClass(),
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
        <div className="fullDescription">
          <FaInfoCircle />
          <span className="">{this.props.description}</span>
        </div>
      );
      fullOwner = (
        <div className="fullOwner">
          <FaUserCircle />
          <AnotherUserProfileCard userId={this.props.owner_id}>
            <span className="fullOwnerSpan">{this.props.owner}</span>
          </AnotherUserProfileCard>
        </div>
      );
      fullRating = (
        <div className="fullRating">
          <FaStar />
          <span className="fullRatingSpan">{this.props.owner_rating}</span>
        </div>
      );

      buttonDownUp = <FaAngleUp className="arrowBtn" onClick={this.handleClick} />;
    } else {
      buttonDownUp = <FaAngleDown className="arrowBtn" onClick={this.handleClick} />;
    }
    return (
      <IconContext.Provider value={{ className: 'global-svg-icon-class' }}>
        <div className="eventWrapper">
          <div className="eventName">
            <h4 className="eventTitle">{this.props.name}</h4>
          </div>
          <div className="mainEventInfo">
            <Image src={this.props.img_url} thumbnail className="d-block" />
            <div className="rightPart">
              <span className="center">
                {' '}
                <GiAmericanFootballBall />
                {' '}
                {this.props.sport_type}
              </span>
              <div className="center">
                <FaDollarSign />
                {' '}
                <span className="priceSpan">{this.props.price}</span>
              </div>
              <div className="center">
                <IoIosPeople />
                {' '}
                <span className="membersSpan">
                  {this.props.members}
                  {' '}
                   of
                  {' '}
                  {this.props.members_total}
                </span>
              </div>
            </div>
          </div>
          <div className="center">
            <FaClock />
            {' '}
            <span className="dateSpan">{this.props.datetime}</span>
          </div>
          <div className="center">
            <MdLocationOn />
            
            {' '}
            <span className="adressSpan">{this.props.adress}</span>
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
