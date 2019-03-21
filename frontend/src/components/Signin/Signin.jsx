import React, { Component } from 'react';
import {Redirect} from "react-router-dom";
// import '../style/sign.css';
import './signin.css'


class SignIn extends Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false,
            redirect: false,
            isUser: '',
            validClass: {email: 'valid', password: 'valid'}
        };
    };

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => {this.validateField(name, value)}
        );
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let validClass = this.state.validClass;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                validClass.email = emailValid ? 'valid': 'invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                validClass.password = passwordValid ? 'valid': 'invalid';
                break;
            default:
                break;
        }
        this.setState({
                formErrors: fieldValidationErrors,
                emailValid: emailValid,
                passwordValid: passwordValid,
                validClass: validClass
            },
            this.validateForm);
    };

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let obj = {};
        obj.email = this.state.email;
        obj.password = this.state.password;

        fetch('http://localhost:5999/signIn',
            {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({obj})
            }
        )
            .then(response => response.json())
            .then(response => {
                if (response['code'] === 200) {
                    this.setState({redirect: true});
                    this.props.handleClick(response['message'])
                }else if (response['message'] === 'not confirmed'){
                    this.setState({isUser: 'Confirm your email'})
                }
                else {
                    this.setState({isUser: 'Enter correct email or password'})
                }
            })
    };

    render () {
        const redirect = this.state.redirect;

        if (redirect) {
            return <Redirect to='/'/>;
        }

        return (
            <div className="signindiv">
                <form className="FormSign" onSubmit = {this.handleSubmit}>
                    <div>
                        <div>Email</div> 
                        <input className={this.state.validClass.email}
                            type="email" name="email"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.handleUserInput}
                        />
                        <div className="formErrors">{this.state.formErrors.email}</div>
                    </div>
                    
                    <div>
                        <div>Password</div>
                        <input className={this.state.validClass.password}
                            type="password" name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleUserInput}
                        />
                        <div className="formErrors">{this.state.formErrors.password}</div>
                    </div>
                    
                    <button type="submit" disabled={!this.state.formValid}>Sign in</button>
                    <label className='Error'>{this.state.isUser}</label>
                </form>
            </div>

        )
    }
}

export default SignIn;
