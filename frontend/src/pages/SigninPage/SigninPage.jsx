import React  from 'react';
import SignIn from '../SigninPage/Signin/SignIn';
import Facebook from '../Facebook';
import Google from '../Google';

import './signin_page.css';

const Signin = (props) => (
  <div className="signinPage">
    <SignIn handleClick={props.handleClick}/>
    <Facebook handleClick={props.handleClick} /><br/>
    <Google handleClick={props.handleClick}/>
  </div>
  );

export default Signin;
