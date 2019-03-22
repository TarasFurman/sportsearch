import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Col,Row,Container,Image} from "react-bootstrap";
import "../../style/profileStyles/css/style.css";
import imgProfile from "../../style/profileStyles/img/img-profile.jpg";
import userRating from "../../style/profileStyles/img/rating-background.svg";
import { Fa,FaViber, FaTelegram, FaRegEdit } from 'react-icons/fa';
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";


class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData:{},
      isLoggedin:true,
      isEditble: false,
      checkedUserData: {
        email:'',
        phone:'',
        first_name:'',
        last_name:'',
        birth_date:'',
        image_url:'',
        description:'',
        viber_account:'',
        telegram_account:'',
        nickname:'',
      },
      fieldsValids:{
        email:false,
        phone:false,
        first_name:false,
        last_name:false,
        birth_date:false,
        image_url:false,
        description:false,
        viber_account:true,
        telegram_account:true,
      },
    };
    this.handleEdit = this.handleEdit.bind(this);

  }
  handleEdit(){
    this.setState(prevState => ({
      isEditble: !prevState.isEditble
    }));
  }

  componentDidMount() {
    fetch( "http://localhost:5999/profile",
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
          userData:this.checkData(data.user_data),
          isLoggedin:true,
        })
      } else {  this.setState({
        userData:data.user_data,
        isLoggedin:false,
      })
      }})
  }

  checkData(data){
    let checkedUserData = {...this.state.checkedUserData};
    let fieldsValids = {...this.state.fieldsValids};
    if ((data.first_name==='') || (data.first_name===undefined) || data.first_name===null){
      checkedUserData.first_name='Empty or short value';
      fieldsValids.first_name=false;
    } else {
      checkedUserData.first_name = data.first_name;
      fieldsValids.first_name=true;
    }
    if (data.last_name==='' || data.last_name===undefined || data.last_name===null || data.last_name.length < 3){
      checkedUserData.last_name='Empty or short value';
      fieldsValids.last_name=false;
    } else {
      checkedUserData.last_name=data.last_name;
      fieldsValids.last_name=true;
    }
    if (data.phone==='' || data.phone===undefined || data.phone===null || data.phone.match(/^\+380\d{3}\d{2}\d{2}\d{2}$/)===null){
      checkedUserData.phone='Empty or error value';
      fieldsValids.phone=false;
    }else {
      checkedUserData.phone = data.phone;
      fieldsValids.phone=true;
    }
    if (data.birth_date==='' || data.birth_date===undefined || data.birth_date===null){
      checkedUserData.birth_date='Empty birth date';
      fieldsValids.birth_date=false;
    } else {
      checkedUserData.birth_date = data.birth_date;
      fieldsValids.birth_date=true;
    }
    if (data.email==='' || data.email===undefined || data.email===null || data.email.match(/^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$/i)===null){
      checkedUserData.email='Empty or wrong email';
      fieldsValids.email=false;
    }else {
      checkedUserData.email=data.email;
      fieldsValids.email=true;
    }
    if (data.description==='' || data.description===undefined || data.description===null || data.description.length < 50){
      checkedUserData.description='Empty or too short value(min 50 symbols)';
      fieldsValids.description=false;
    } else {
      checkedUserData.description=data.description;
      fieldsValids.description=true;
    }
    if (data.image_url==='' || data.image_url===undefined || data.image_url===null){
      checkedUserData.image_url=imgProfile;
      fieldsValids.image_url=false;
    }
    else {
      checkedUserData.image_url=data.image_url;
      fieldsValids.image_url=true;
    }
    checkedUserData.nickname=data.nickname;
    this.setState({checkedUserData});
    this.setState({fieldsValids});

  }
  render(){
    let renderBlock;
    if (!this.state.isLoggedin){
          renderBlock =  <Container fluid>
                            <div className="deniedImg"><Image src="https://cdn.windowsreport.com/wp-content/uploads/2017/11/extract-rar-access-denied-fix.png" fluid/></div>
                            <div><h2 style={{textAlign:'center'}}>Access to this page deneid! Please <Link to="/signup">Sign up</Link> or <Link to="/signin">Sign in</Link></h2></div>
                         </Container>
        } else {
          if (!this.state.isEditble){
            renderBlock=<ProfileView checkedUserData = {this.state.checkedUserData} editClick={this.handleEdit} fieldsValids={this.state.fieldsValids}/>;
          } else {
            renderBlock = <ProfileEdit checkedUserData = {this.state.checkedUserData} editClick={this.handleEdit} fieldsValids={this.state.fieldsValids} userId = {this.props.userId}/>;
          }
        }
        return (
          <React.Fragment>
            {renderBlock}
          </React.Fragment>
        );

  }
}

export default ProfileComponent;
