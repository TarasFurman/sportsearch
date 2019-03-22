import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Col,Row,Container,Image} from "react-bootstrap";
import "../../style/profileStyles/css/style.css";
import imgProfile from "../../style/profileStyles/img/img-profile.jpg";
import userRating from "../../style/profileStyles/img/rating-background.svg";
import { Fa,FaViber, FaTelegram, FaRegEdit } from 'react-icons/fa';


class ProfileView extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.editClick();
  }


  render(){
    return (
      <div id="main-wrapper">
         <div className="userinfo">
             <Container>
                 <Row>
                     <Col md={3}>
                         <div className="profile-img">
                             <Image src={this.props.checkedUserData.image_url} trumbnail/>
                         </div>
                         <div className="userRating">
                           <img src={userRating}  />
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

                         <p>
                           <h5>About me</h5>
                           <span className={this.props.fieldsValids.description ? '': 'empty_field'}> {this.props.checkedUserData.description} </span>
                         </p>

                         <ul className="social-icon">
                             <li><a href="http://t.me/SportSearchBot"><FaTelegram/></a></li>
                             <li><a href="#"><FaViber/></a></li>
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
