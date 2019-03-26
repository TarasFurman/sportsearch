import React from 'react';
import SignUp from './Signup/Signup';
import Facebook from '../Facebook';
import Google from '../Google';

import './signup_page.css'

const Signup = (props) => (
    <div className="signupPage">
        <SignUp />
        <Facebook handleClick={props.handleClick} /><br/>
        <Google />
    </div>
);

export default Signup;
