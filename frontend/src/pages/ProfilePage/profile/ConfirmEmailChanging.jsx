import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {Col,Row,Container,Image,Button} from "react-bootstrap";

class ConfirmEmailChanging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token:'',
      password:'',
      message:false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    let password;
    password = this.state.password;
    fetch( 'http://localhost:5999/change_email/'+this.props.match.params.token,
        {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({password})
        }
    )
        .then(response => response.json())
        .then(response => {
            if (response['code'] === 200) {
              this.setState({message:true})
            }else if (response['code'] === 1) {

            }
        })
  }
  componentDidMount(){
    fetch( 'http://localhost:5999/change_email/'+this.props.match.params.token,
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

      }
    });
  }

  render(){
    if (this.state.message) {
      return(<p> Changed!</p>);
    }
    else {
    return(
        <Container fluid>
          <Row>
            <Col lg={12}>
              <h1>Enter your password to end your email changing</h1>
              <form className="FormEmailChange" onSubmit={this.handleSubmit}>
                    <input type="password" name="password"
                           placeholder="Password"
                           value={this.state.password}
                           onChange={this.handleChange}
                    />
                  <Button className="CustomSubmitButton" type="submit" style={{backgroundColor:`rgb(98, 179, 98)`, marginTop:`20px`}}>Confirm</Button>
              </form>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default ConfirmEmailChanging;
