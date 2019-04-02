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
            <Link className="userName" to="/profile/">Profile</Link>
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

    // function humburgerClick(){
    //     var forEach=function(t,o,r){
    //         if("[object Object]"===Object.prototype.toString.call(t))
    //             for(var c in t)
    //                 Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);
    //         else 
    //             for(var e = 0,l = t.length; l > e; e++)
    //                 o.call(r,t[e],e,t)};
    //     var hamburgers = document.querySelectorAll(".hamburger");
    //     if (hamburgers.length > 0) {
    //         forEach(hamburgers, function(hamburger) {
    //             hamburger.addEventListener("click", function() {
    //                 this.classList.toggle("is-active");
    //             }, false);
    //         });
    //     }
    // }

    return (
        <div className="headerWrapper">
            <div className="header">
                <Link className="sportTitle" to="/">SportSearch</Link>
                {header}
<<<<<<< HEAD
                <button onClick={humburgerClick} className="hamburger hamburger--squeeze">
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
=======
                {/* <button onClick={humburgerClick} class="hamburger hamburger--squeeze">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
>>>>>>> map_hotfixes
                    </span>
                </button> */}
            </div>
        </div>
    )
};

export default Navbar;
