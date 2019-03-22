import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import {Col,Row,Container,Image} from "react-bootstrap";
import "../../style/profileStyles/css/style.css";
import imgProfile from "../../style/profileStyles/img/img-profile.jpg";
import userRating from "../../style/profileStyles/img/rating-background.svg";
import { Fa,FaViber, FaTelegram, FaRegEdit } from 'react-icons/fa';


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
      confirmEmail: '',
      redirect: false,
      validClass: {firstName: 'valid', lastName: 'valid', email: 'valid', phone: 'valid', birthDate: 'valid', description: 'valid'}

    };
  this.handleEdit = this.handleEdit.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleInputChange = this.handleInputChange.bind(this);
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
    console.log(obj);
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
            console.log(response);
            if (response['code'] === 200) {
              this.props.editClick();
            }else if (response['code'] === 1) {

            }
        })

  }

  render(){

    return (
      <div id="main-wrapper">
                          <div className="userinfo">
                              <Container>
                                  <Row>
                                    <form onSubmit = {this.handleSubmit}>
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
                                                      <strong>{this.props.checkedUserData.email}</strong>
                                                      <small>EMAIL</small>
                                                  </div>
                                              </Col>
                                              <Col md={6}>
                                                  <div className="personal-details">
                                                      <strong ><input className={this.state.validClass.birthDate} type="date" name="birth_date" placeholder={this.props.checkedUserData.birth_date}  value={this.state.birth_date} onChange={this.handleInputChange} /></strong>
                                                      <small>BIRTH</small>
                                                      <div className="formErrors">{this.state.formErrors.birthDate}</div>
                                                  </div>
                                              </Col>
                                          </Row>

                                          <p>
                                            <h5>About me</h5>
                                            <span> <input className={this.state.validClass.description} type="text" name="description" placeholder={this.props.checkedUserData.description}  value={this.state.description} onChange={this.handleInputChange} /> </span>
                                            <div className="formErrors">{this.state.formErrors.description}</div>
                                          </p>
                                          <ul className="social-icon">
                                              <li><a href="http://t.me/SportSearchBot"><FaTelegram/></a></li>
                                              <li><a href="#"><FaViber/></a></li>
                                          </ul>
                                          <button type="submit" style={{background:'#343a40'}} disabled={!this.state.formValid} >Update Info</button>
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
