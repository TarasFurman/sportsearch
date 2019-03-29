import React, {Component} from 'react';
import GoogleLogin from 'react-google-login';
import {Redirect} from 'react-router-dom';

class Google extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loginError: false,
      redirect: false,
    };
  }

  PostData(type, userData) {
    let BaseURL = 'http://localhost:5999/';
    
    return new Promise ((resolve, reject) => {
      fetch(BaseURL + type, {
          headers:{
            'Content-Type': 'application/json'
          },
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify(userData)
        })
        .then((response) => response.json())
        .then((response) => {
          console.log("res");
            if(response['message'] === 'not confirmed') {
                console.log("not working");
            }
            else if(response['message'] === 'login') {
                this.setState({redirect: true})
            }   
            else if(response['message'] === 'register') {
                this.setState({redirect: true})
            }  
            else{
                console.log("nothing")
            }
        })
        .catch((error) => {
          reject(error);
        });
      }
    );
  }

  signup(res, type) {
    let postData;
    
    if (type === 'google' && res.w3.U3) {
      postData = {
        type: 'google',
        name: res.w3.ig,
        provider: type,
        email: res.w3.U3,
        provider_id: res.El,
        token: res.Zi.access_token,
        provider_pic: res.w3.Paa
      };
    }

    if (postData) {
      this.PostData(postData.type , postData).then((result) => {
        sessionStorage.setItem('userData', JSON.stringify(result));
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return (window.location.reload(), <Redirect to={'/'}/>)
    }

    const responseGoogle = (response) => {
      this.signup(response, 'google');
    }

    return (
      <div>
        <GoogleLogin
          clientId="461949919217-5152ipl4rmbplp8hdglpoughpqb6ini0.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}/>
      </div>
    );
  }
}

export default Google;