import React from 'react';
import SignUp from '../../components/Signup/Signup'
import Facebook from '../../components/Facebook'
import Google from '../../components/Google';

import './signup_page.css'

const Signup = (props) => (
    <div className="signupPage">
        <SignUp />
        <Facebook handleClick={props.handleClick} /><br/>
        <Google />
    </div>
);

export default Signup;
