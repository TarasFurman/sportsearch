import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import {Col,Row,Container,Image,Button} from "react-bootstrap";
import "../profileStyles/css/style.css";
import imgProfile from "../profileStyles/img/img-profile.jpg";
import userRating from "../profileStyles/img/rating-background.svg";
import { Fa,FaViber, FaTelegram, FaRegEdit } from 'react-icons/fa';
import StarRatings from 'react-star-ratings';
import UploadProfilePhoto from "./UploadProfilePhoto";


class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birth_date: '',
      description:'',
      formErrors: {firstName: '', lastName: '', email: '', phone: '', birthDate: '', description: ''},
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true,
      phoneValid: true,
      birthDateValid: true,
      formValid: false,
      descriptionValid:true,
      redirect: false,
      changePassMessage:'',
      showImgWindow: false,
      validClass: {firstName: 'valid', lastName: 'valid', email: 'valid', phone: 'valid', birthDate: 'valid', description: 'valid'}
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this.handleImgClick = this.handleImgClick.bind(this);
    this.imgChecker = this.imgChecker.bind(this);
  }

  imgChecker(img) {
    this.props.ImgChange(img);
  }
  handleImgClick () {
    this.setState(prevState => ({
      showImgWindow: !prevState.showImgWindow,
    }));
  }
  _onFocus(e){
    e.currentTarget.type = "date";
  }
  _onBlur(e){
      e.currentTarget.type = "text";
      e.currentTarget.placeholder = this.props.checkedUserData.birth_date;
  }

  handleChangePass(){
    this.setState({
      changePassMessage:'To continue changing our password, go to your email',
    });
    fetch( "http://localhost:5999/change-password",
        {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(response => {
        })
  }

    handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => {this.validateField(name, value)}
        );
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let emailValid = this.state.emailValid;
        let phoneValid = this.state.phoneValid;
        let birthDateValid = this.state.birthDateValid;
        let descriptionValid = this.state.descriptionValid;
        let validClass = this.state.validClass;

        switch(fieldName) {
            case 'first_name':
                firstNameValid = value.length >= 3;
                fieldValidationErrors.firstName = firstNameValid ? '': 'too short';
                validClass.firstName = firstNameValid ? 'valid': 'invalid';
                break;
            case 'description':
                descriptionValid = value.length >= 50;
                fieldValidationErrors.description = descriptionValid ? '': 'too short';
                validClass.description = descriptionValid ? 'valid': 'invalid';
                break;
            case 'last_name':
                lastNameValid = value.length >= 3;
                fieldValidationErrors.lastName = lastNameValid ? '': 'too short';
                validClass.lastName = lastNameValid ? 'valid': 'invalid';
                break;
            case 'phone':
                if (value.length > 0) {
                    phoneValid = value.match(/^\+380\d{3}\d{2}\d{2}\d{2}$/);
                } else{
                    phoneValid = true;
                }
                fieldValidationErrors.phone = phoneValid ? '' : '+380*********';
                validClass.phone = phoneValid ? 'valid': 'invalid';
                break;
            case 'birth_date':
                let currentTime = new Date();
                let day = currentTime.getDate();
                let month = currentTime.getMonth()+1;
                let year = currentTime.getFullYear()-4;
                let today = year + '-' + '0' + month + '-' + day;
                birthDateValid = value < today;
                fieldValidationErrors.birthDate = birthDateValid ? '': 'incorrect';
                validClass.birthDate = birthDateValid ? 'valid': 'invalid';
                break;
            case 'email':
                emailValid = value.match(/^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Enter correct email';
                validClass.email = emailValid ? 'valid': 'invalid';
                break;
            default:
                break;
        }
        this.setState({
                formErrors: fieldValidationErrors,
                firstNameValid: firstNameValid,
                lastNameValid: lastNameValid,
                emailValid: emailValid,
                phoneValid: phoneValid,
                birthDateValid: birthDateValid,
                descriptionValid:descriptionValid,
                validClass: validClass
            },
            this.validateForm);
    };

    validateForm() {
        this.setState({formValid: this.state.firstNameValid &&this.state.lastNameValid &&
                this.state.emailValid && this.state.phoneValid && this.state.birthDateValid && this.state.descriptionValid});
    };


  handleEdit(){
    this.props.editClick();
  }


  handleSubmit(e){
    e.preventDefault();
    let obj = {};
    obj.first_name = this.state.first_name ? this.state.first_name: this.props.checkedUserData.first_name ;
    obj.last_name = this.state.last_name ? this.state.last_name: this.props.checkedUserData.last_name ;
    obj.email = this.state.email ? this.state.email: this.props.checkedUserData.email;
    obj.phone = this.state.phone ? this.state.phone: this.props.checkedUserData.phone ;
    obj.description = this.state.description ? this.state.description: this.props.checkedUserData.description ;
    obj.birth_date = this.state.birth_date ? this.state.birth_date: this.props.checkedUserData.birth_date ;
    if (obj.email !=  this.props.checkedUserData.email ) {
      this.props.popupClick();
    }
    fetch( "http://localhost:5999/profile",
        {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({obj})
        }
    )
        .then(response => response.json())
        .then(response => {
            if (response['code'] === 200) {
              this.props.submitClick();
            }else if (response['code'] === 1) {

            }
        })

  }

  render(){
    let buttonLink = '/feedbacks/'+this.props.checkedUserData.user_id;
    return (
      <div id="main-wrapper">
        {this.state.showImgWindow ? <UploadProfilePhoto popupClick = {this.handleImgClick} imgChanger = {this.imgChecker}  /> : ''}
                          <div className="userinfo">
                              <Container>
                                  <Row>
                                    <form onSubmit = {this.handleSubmit}>
                                      <Col md={3}>
                                          <div className="profile-img" onClick={this.handleImgClick}>
                                              <Image src={this.props.checkedUserData.image_url} trumbnail="true"  />
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
                                              <h1 className="name">
                                                <input className={this.state.validClass.firstName} type="text" name="first_name" placeholder={this.props.checkedUserData.first_name}  value={this.state.first_name} onChange={this.handleInputChange} />
                                                <input className={this.state.validClass.lastName} type="text" name="last_name" placeholder={this.props.checkedUserData.last_name}  value={this.state.last_name} onChange={this.handleInputChange} />
                                                <span className="editButton_active" onClick={this.handleEdit}><FaRegEdit/></span>
                                              </h1>
                                              <div className="formErrors">{this.state.formErrors.firstName}</div>
                                              <div className="formErrors">{this.state.formErrors.lastName}</div>
                                            <span>Great Player</span>
                                          </div>
                                          <Row>
                                              <Col md={6}>
                                                  <div className="personal-details">
                                                      <strong>{this.props.checkedUserData.nickname}</strong>
                                                      <small>NICKNAME</small>
                                                  </div>
                                              </Col>
                                              <Col md={6}>
                                                  <div className="personal-details">
                                                      <strong><input className={this.state.validClass.phone} type="text" name="phone" placeholder={this.props.checkedUserData.phone}  value={this.state.phone} onChange={this.handleInputChange} /></strong>
                                                      <small>PHONE</small>
                                                      <div className="formErrors">{this.state.formErrors.phone}</div>
                                                  </div>
                                              </Col>
                                              <Col md={6}>
                                                  <div className="personal-details">
                                                      <strong><input className={this.state.validClass.email} type="text" name="email" placeholder={this.props.checkedUserData.email}  value={this.state.email} onChange={this.handleInputChange} /></strong>
                                                      <small>EMAIL</small>
                                                  </div>
                                              </Col>
                                              <Col md={6}>
                                                  <div className="personal-details">
                                                      <strong ><input className={this.state.validClass.birthDate} type="text" name="birth_date"  placeholder={this.props.checkedUserData.birth_date} onFocus={this._onFocus} onBlur={this._onBlur} value={this.state.birth_date} onChange={this.handleInputChange} /></strong>
                                                      <small>BIRTH</small>
                                                      <div className="formErrors">{this.state.formErrors.birthDate}</div>
                                                  </div>
                                              </Col>
                                              <Col md={12}>
                                                <Button onClick={this.handleChangePass}>Change/Add Password</Button>
                                                <p>{this.state.changePassMessage}</p>
                                              </Col>
                                          </Row>

                                          <h5>About me</h5>
                                          <p>
                                            <span> <input className={this.state.validClass.description} type="text" name="description" placeholder={this.props.checkedUserData.description}  value={this.state.description} onChange={this.handleInputChange} /> </span>
                                            <div className="formErrors">{this.state.formErrors.description}</div>
                                          </p>
                                          <ul className="social-icon">
                                              <li><a href="http://t.me/SportSearchBot"><FaTelegram/></a></li>
                                          </ul>
                                          <Button type="submit" size="lg" style={{background:'rgb(98, 179, 98)'}} disabled={!this.state.formValid} >Update Info</Button>
                                      </Col>
                                    </form>
                                  </Row>
                              </Container>
                          </div>
                        </div>
    );

  }
}

export default ProfileEdit;
