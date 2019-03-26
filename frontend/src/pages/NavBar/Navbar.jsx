import React from 'react';
import { Link } from 'react-router-dom';
import Popup from "reactjs-popup";
import './navbar.css';

const Sign = () =>{
    return(
        <div className="sign">
            <Link className="signup" to="/signup">Sign up</Link>
            <Link className="signin" to="/signin">Sign in</Link>
        </div>
    )
};

const Notification = (props) =>{

        return (
        <div className="card">
            <div className="content">
                <h6>{props.eventId}</h6>
                {props.notificationType}
            </div>
        </div>
    )
};

const User = (props) =>{
    function handleClick(){
        fetch('http://localhost:5999/logout',
            {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            }
        )
        .then(response => response.json())
        .then(response => {
          if (response['code'] === 200){
              props.handleClick('')
          }
        }
        )
    }

    function createNotification() {
        let notifications = props.notifications.map(notification =>
            <Notification
                key={notification.id}
                eventId={notification.event_name}
                notificationType={notification.notification_message}
            />
        );
        return(
            <div>{notifications}</div>
        )
    }

    return(
        <div className="user">
            <Link className="createEvent" to="/createEvent">Create Event</Link>
            <Link className="settings" to="/settings">Settings</Link>
            <Link to="/profile/">{props.user}</Link>
            <Link className="myEvents" to={"/my-events"} > My events </Link>
            <Popup
                trigger={<a href="#" className="notifications">Notification</a>} position="bottom center">
                <div>Notifications</div>
                {createNotification()}
            </Popup>
            <button className="logout" onClick={handleClick}>Log out</button>
        </div>
    )
};

const Navbar = (props) => {
    let header;
    if (props.user) {
        header = <User user={props.user}
                       notifications={props.notifications}
                       handleClick={props.handleClick}/>
    }else{
        header = <Sign/>
    }

    return (
        <div className="headerWrapper">
            <div className="header">
                <Link className="sportTitle" to="/">SportSearch</Link>
                {header}
            </div>
        </div>
    )
};

export default Navbar;
