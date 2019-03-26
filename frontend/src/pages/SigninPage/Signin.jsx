import React  from 'react';
import SignIn from '../../components/Signin/Signin'
import Facebook from '../../components/Facebook'
import Google from '../../components/Google';

import './signin_page.css';


const Signin = (props) => (
  <div className="signinPage">
    <SignIn handleClick={props.handleClick}/>
    <Facebook handleClick={props.handleClick} /><br/>
    <Google handleClick={props.handleClick}/>
  </div>
  );

export default Signin;
