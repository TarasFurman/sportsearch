import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Col,Row,Container,Image , Button} from "react-bootstrap";
import "../profileStyles/css/style.css";
import imgProfile from "../profileStyles/img/img-profile.jpg";
import userRating from "../profileStyles/img/rating-background.svg";
import StarRatings from 'react-star-ratings';
import { Fa,FaViber, FaTelegram, FaRegEdit } from 'react-icons/fa';
import ProfilePopup from "./ProfilePopup";


class ProfileView extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.editClick();
  }


  render(){
    let buttonLink = '/feedbacks/'+this.props.checkedUserData.user_id;
    return (
      <div id="main-wrapper">
        {this.props.confirmEmail ?
          <ProfilePopup
            closePopup={this.props.popupClick}
          />
          : null
        }
         <div className="userinfo">
             <Container>
                 <Row>
                     <Col md={3}>
                         <div className="profile-img">
                             <Image src={this.props.checkedUserData.image_url} trumbnail="true"/>
                         </div>
                         <div className="userRating">
                           <StarRatings
                              rating={this.props.checkedUserData.rating ? this.props.checkedUserData.rating : 0 }
                              starRatedColor="rgb(98, 179, 98)"
                              numberOfStars={5}
                              starDimension = {'30px'}
                            />
                         </div>
                         <div className="getFeedbacks">
                            <Button size="sm" href={buttonLink}>Feedbacks</Button>
                         </div>
                     </Col>
                     <Col md={9}>
                         <div className="name-wrapper">
                             <h1 className="name"><span className={this.props.fieldsValids.first_name ? 'non_empty': 'empty_field'}>{this.props.checkedUserData.first_name}</span><span className={this.props.fieldsValids.last_name ? 'non_empty': 'empty_field'}> {this.props.checkedUserData.last_name}</span> <span className="editButton" onClick={this.handleChange} ><FaRegEdit/></span></h1>
                             <span>Great Player</span>
                         </div>
                         <Row>
                             <Col md={6}>
                                 <div className="personal-details">
                                     <strong >{this.props.checkedUserData.nickname}</strong>
                                     <small>NICKNAME</small>
                                 </div>
                             </Col>
                             <Col md={6}>
                                 <div className="personal-details">
                                     <strong className={this.props.fieldsValids.phone ? '': 'empty_field'}>{this.props.checkedUserData.phone}</strong>
                                     <small>PHONE</small>
                                 </div>
                             </Col>
                             <Col md={6}>
                                 <div className="personal-details">
                                     <strong className={this.props.fieldsValids.email ? '': 'empty_field'}>{this.props.checkedUserData.email}</strong>
                                     <small>EMAIL</small>
                                 </div>
                             </Col>
                             <Col md={6}>
                                 <div className="personal-details">

                                     <strong className={this.props.fieldsValids.birth_date ? '': 'empty_field'}>{this.props.checkedUserData.birth_date}</strong>
                                     <small>BIRTH</small>
                                 </div>
                             </Col>
                         </Row>

                         <h5>About me</h5>
                         <p>
                           <span className={this.props.fieldsValids.description ? '': 'empty_field'}> {this.props.checkedUserData.description} </span>
                         </p>

                         <ul className="social-icon">
                             <li><a href="http://t.me/SportSearchBot"><FaTelegram/></a></li>
                         </ul>
                     </Col>
                 </Row>
             </Container>
         </div>
       </div>
    );
  }
}

export default ProfileView;
