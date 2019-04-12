import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Col,Row,Container,Image,Button} from "react-bootstrap";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token:'',
      password: '',
      message: false,
      confirmPassword: '',
      passwordValid: false,
      confirmPasswordValid: false,
      formValid: false,
      formErrors: {password: '', confirmPassword: ''},
      validClass: {password: 'valid', confirmPassword: 'valid'},
      badRequest:false,
    };
  }

  handleUserInput = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({[name]: value},
          () => {this.validateField(name, value)}
      );
  };

  validateField(fieldName, value) {
      let passwordValid = this.state.passwordValid;
      let confirmPasswordValid = this.state.confirmPasswordValid;
      let fieldValidationErrors = this.state.formErrors;
      let validClass = this.state.validClass;
      switch(fieldName) {
          case 'password':
              passwordValid = value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
              passwordValid = true;
              fieldValidationErrors.password = passwordValid ? '': '6-20 symbols, big letter, small letter, number, @#$%';
              validClass.password = passwordValid ? 'valid': 'invalid';
              break;
          case 'confirmPassword':
              confirmPasswordValid = this.state.confirmPassword === this.state.password;
              fieldValidationErrors.confirmPassword = confirmPasswordValid ? '': ' !== password';
              validClass.confirmPasswordValid = confirmPasswordValid ? 'valid': 'invalid';
              break;
          default:
              break;

      }
      this.setState({
              formErrors: fieldValidationErrors,
              passwordValid: passwordValid,
              confirmPasswordValid: confirmPasswordValid,
              validClass: validClass
          },
          this.validateForm);
  };
  validateForm() {
      this.setState({formValid: this.state.passwordValid && this.state.confirmPasswordValid});
  };
  componentDidMount(){
    fetch( 'http://localhost:5999/confirm_password_changing/'+this.props.match.params.token,
    {
      headers:{
        'Content-Type': 'application/json'
      },
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      if (data['code'] === 200) {
        this.setState({
          token:this.props.match.params.token,
        })
      } else {
        this.setState({
        badRequest:true,
        })
      }
    });
  }

  handleSubmit = (event) =>{
      event.preventDefault();
      let obj = {};
      obj.password = this.state.password;
      obj.confirm_password = this.state.confirmPassword;

      fetch("http://localhost:5999/confirm_password_changing/"+this.props.match.params.token,
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
                this.setState({message:true})
              }else  {
                this.setState({
                badRequest:true,
                })
              }
          })
  }


  render(){
    if (this.state.message) {
      return(<p> Changed!</p>);
    }
    else if (this.state.badRequest) {
    return(
       'Error 400: Bad request'
     );
    }
    else {
      return(
        <Container fluid>
          <Row>
            <Col lg={12}>
              <h1>Change Password</h1>
              <form className="FormPasswordChange" onSubmit={this.handleSubmit}>
                <div>
                    <p style={{color: `#444444`, fontWeight: `700`}}>Password (6-20 symbols, big letter, small letter, number, @#$%)</p>
                    <input className={this.state.validClass.password}
                        type="password" name="password"
                           placeholder="Password"
                           value={this.state.password}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.password}</div>
                </div>
                <div>
                    <p style={{color: `#444444`, fontWeight: `700`}}>Confirm Password</p>
                    <input className={this.state.validClass.confirmPassword}
                        type="password" name="confirmPassword"
                           placeholder="Password"
                           value={this.state.confirmPassword}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.confirmPassword}</div>
                </div>
                <Button type="submit" disabled={!this.state.formValid} style={{backgroundColor:`rgb(98, 179, 98)`, marginTop:`20px`}}>Confirm</Button>
                <div className="formErrors">{this.state.confirmEmail}</div>
              </form>
            </Col>
          </Row>
       </Container>
     );
    }
  }

}

export default ChangePassword;
