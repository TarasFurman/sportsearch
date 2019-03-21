import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import {Redirect} from "react-router-dom";

export default class Facebook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userID: "",
            name: "",
            email: "",
            picture: "",
            first_name: "",
            last_name: "",
            accessToken: "",
            redirect: false
          };
    }
    
    responseFacebook = response => {

        this.setState({
            isLoggedIn: true,
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url,
            last_name: response.last_name,
            first_name: response.first_name,
            accessToken: response.accessToken
          });

        let obj = {};
        obj.email = this.state.email;
        obj.first_name = this.state.first_name;
        obj.last_name = this.state.last_name;
        obj.accessToken = this.state.accessToken;
        obj.auth_type = "facebook";

        fetch('http://localhost:5999/facebook',
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
                if(response['message'] === 'not confirmed') {
                    console.log("not working");
                }
                else if(response['message'] !== 'not confirmed') {
                    this.setState({redirect: true})
                    this.props.handleClick(response['message'])
                }  
                else{
                    console.log("nothing")
                }
        })
    };

    render(){
        const redirect = this.state.redirect;

        if (redirect) {
            return <Redirect to='/'/>;
        }

        return(
            <FacebookLogin
                appId="242292630007346"
                autoLoad={false}
                fields="name,email,picture,first_name,last_name"
                callback={this.responseFacebook} />
        )
    }
}
