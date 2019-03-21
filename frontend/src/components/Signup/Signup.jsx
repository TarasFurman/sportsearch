import React, { Component } from 'react';
// import '../style/sign.css';

class SignUp extends Component {
    constructor (props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            birthDate: '',
            password: '',
            confirmPassword: '',
            formErrors: {firstName: '', lastName: '', email: '', phone: '', birthDate: '', password: '', confirmPassword: ''},
            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,
            phoneValid: true,
            birthDateValid: false,
            passwordValid: false,
            confirmPasswordValid: false,
            formValid: false,
            confirmEmail: '',
            redirect: false,
            validClass: {firstName: 'valid', lastName: 'valid', email: 'valid', phone: 'valid', birthDate: 'valid', password: 'valid', confirmPassword: 'valid'}
        }
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
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let emailValid = this.state.emailValid;
        let phoneValid = this.state.phoneValid;
        let birthDateValid = this.state.birthDateValid;
        let passwordValid = this.state.passwordValid;
        let confirmPasswordValid = this.state.confirmPasswordValid;
        let validClass = this.state.validClass;

        switch(fieldName) {
            case 'firstName':
                firstNameValid = value.length >= 3;
                fieldValidationErrors.firstName = firstNameValid ? '': 'too short';
                validClass.firstName = firstNameValid ? 'valid': 'invalid';
                break;
            case 'lastName':
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
            case 'birthDate':
                let currentTime = new Date();
                let day = currentTime.getDate();
                let month = currentTime.getMonth()+1;
                let year = currentTime.getFullYear();
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
                firstNameValid: firstNameValid,
                lastNameValid: lastNameValid,
                emailValid: emailValid,
                phoneValid: phoneValid,
                birthDateValid: birthDateValid,
                passwordValid: passwordValid,
                confirmPasswordValid: confirmPasswordValid,
                validClass: validClass
            },
            this.validateForm);
    };

    validateForm() {
        this.setState({formValid: this.state.firstNameValid &&this.state.lastNameValid &&
                this.state.emailValid && this.state.phoneValid && this.state.birthDateValid &&
                this.state.passwordValid && this.state.confirmPasswordValid});
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let obj = {};
        obj.first_name = this.state.firstName;
        obj.last_name = this.state.lastName;
        obj.email = this.state.email;
        obj.phone = this.state.phone;
        obj.password = this.state.password;
        obj.birth_date = this.state.birthDate;
        obj.confirm_password = this.state.confirmPassword;

        fetch('http://localhost:5999/signUp',
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
                console.log(response);
                if (response['code'] === 200) {
                    this.setState({redirect: true});
                }else if (response['code'] === 1) {
                    this.setState({confirmEmail:'Email is used'})
                    }else{
                    this.setState({confirmEmail: 'Try one more'});
                }
            })
    };

    render () {
        const redirect = this.state.redirect;

        if (redirect) {
            return <h1>Mail was send!</h1>;
        }

        return (
            <form className="FormSign" onSubmit = {this.handleSubmit}>
                <div>
                    First name<span style={{color : 'red'}}>*</span>
                    <input className={this.state.validClass.firstName}
                           type="text" name="firstName"
                           placeholder="First name"
                           value={this.state.firstName}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.firstName}</div>
                </div>

                <div>
                    Last name<span style={{color : 'red'}}>*</span>
                    <input className={this.state.validClass.lastName}
                        type="text" name="lastName"
                           placeholder="Last name"
                           value={this.state.lastName}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.lastName}</div>
                </div>

                <div>
                    Email<span style={{color : 'red'}}>*</span>
                    <input className={this.state.validClass.email}
                           type="email" name="email"
                           placeholder="Email"
                           value={this.state.email}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.email}</div>
                </div>

                <div>
                    Phone
                    <input className={this.state.validClass.phone}
                        type="text" name="phone"
                           placeholder="Phone"
                           value={this.state.phone}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.phone}</div>
                </div>

                <div>
                    Birth date<span style={{color : 'red'}}>*</span>
                    <input className={this.state.validClass.birthDate}
                        type="date" name="birthDate"
                           placeholder="Birth date"
                           value={this.state.birthDate}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.birthDate}</div>
                </div>

                <div>
                    Password (6-20 symbols, big letter, small letter, number, @#$%)<span style={{color : 'red'}}>*</span>
                    <input className={this.state.validClass.password}
                        type="password" name="password"
                           placeholder="Password"
                           value={this.state.password}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.password}</div>
                </div>

                <div>
                    Confirm Password<span style={{color : 'red'}}>*</span>
                    <input className={this.state.validClass.confirmPassword}
                        type="password" name="confirmPassword"
                           placeholder="Password"
                           value={this.state.confirmPassword}
                           onChange={this.handleUserInput}
                    />
                    <div className="formErrors">{this.state.formErrors.confirmPassword}</div>
                </div>

                <br/>
                <button type="submit" disabled={!this.state.formValid}>Sign up</button>
                <div className="formErrors">{this.state.confirmEmail}</div>
            </form>
        )
    }
}

export default SignUp;
