import React from 'react';
import './settings.css';

export default class Settings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoaded: false,
            emailNotification: true,
            telegramNotification: false,
            viberNotification: false,
            requestApproved: false,
            requestRejected: false,
            isKicked: false,
            eventFinished: false,
            eventCanceled: false,
            receivedFeedback: false,
            beforeEvent: false,
            eventRequest: false,
            eventInvitation: false,
            error_data: {}
        }
    }

    isUser(){
        return(
            <div className="settingsWrapper">
                <form className="settingsForm" onSubmit={this.handleSubmit}>
                    <h1>Notifications could be sent to:</h1>
                    <div className="notificationReceiver">
                        <div>
                            <span>Email</span>
                            <input
                                name="emailNotification"
                                type="checkbox"
                                checked={this.state.emailNotification}
                                onChange={this.handleInputChange}
                                className="notificationInput"
                            />
                        </div>
                        
                        <div>
                            <span>Telegram</span>
                            <input
                                name="telegramNotification"
                                type="checkbox"
                                checked={this.state.telegramNotification}
                                onChange={this.handleInputChange}
                                className="notificationInput"

                            />
                        </div>
                        
                        <div>
                            <span>Viber</span>
                            <input
                                name="viberNotification"
                                type="checkbox"
                                checked={this.state.viberNotification}
                                onChange={this.handleInputChange}
                                className="notificationInput"

                            />
                        </div>
                    </div>
                    
                    <h1>Type notification:</h1>

                    <div className="notificationTypeDiv">
                        
                        <div className="notificationTexts">
                            <span> <input
                                name="requestApproved"
                                type="checkbox"
                                checked={this.state.requestApproved}
                                onChange={this.handleInputChange}
                                className="notificationInput"
                            />
                            Your request has been approved</span>
                            <span>
                                <input
                                    name="requestRejected"
                                    type="checkbox"
                                    checked={this.state.requestRejected}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                                Your request has been rejected
                            </span>
                            <span>
                                <input
                                    name="isKicked"
                                    type="checkbox"
                                    checked={this.state.isKicked}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                                You have been kicked from event
                            </span>
                            <span>
                                <input
                                    name="eventFinished"
                                    type="checkbox"
                                    checked={this.state.eventFinished}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                                Event finished
                            </span>
                            <span>
                                <input
                                    name="eventCanceled"
                                    type="checkbox"
                                    checked={this.state.eventCanceled}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                                Event canceled
                            </span>
                            <span>
                                <input
                                    name="receivedFeedback"
                                    type="checkbox"
                                    checked={this.state.receivedFeedback}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                                You received feedback
                            </span>
                            <span>
                                <input
                                    name="beforeEvent"
                                    type="checkbox"
                                    checked={this.state.beforeEvent}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                                1 hour before the event
                            </span>
                            <span>
                                <input
                                    name="eventRequest"
                                    type="checkbox"
                                    checked={this.state.eventRequest}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                            When new request appears (for event owners only)</span>
                            <span>
                                <input
                                    name="eventInvitation"
                                    type="checkbox"
                                    checked={this.state.eventInvitation}
                                    onChange={this.handleInputChange}
                                    className="notificationInput"
                                />
                            You were invited to the event </span>
                        </div>                    
                    </div>
                    <button className="submitSettings" type="submit">Submit</button>
                </form>
            </div>
        )
    }

    notAutorizedUser() {
        return(
            <div className={'notAutorized'}>
                <h1>
                    You do not have an access to this page. Please 
                    <br/> 
                    <p><a href="http://localhost:5998/signup"> Sign up </a>  or  <a href="http://localhost:5998/signin"> Sign in </a></p>
                </h1>
            </div>
        );
    }

    componentDidMount(){
        fetch("http://localhost:5999/settings",
        {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        }
        ).then(response => response.json())
        .then(data=> {
            if(data['code']===200){
                let settings = data.settings_data[0]
                this.setState({
                    isLoaded: true,
                    emailNotification: settings['email_notification'],
                    telegramNotification: settings['telegram_notification'],
                    viberNotification: settings['viber_notification'],
                    requestApproved: settings['request_approved'],
                    requestRejected: settings['request_rejected'],
                    isKicked: settings['is_kicked'],
                    eventFinished: settings['event_finished'],
                    eventCanceled: settings['event_canceled'],
                    receivedFeedback: settings['received_feedback'],
                    beforeEvent: settings['before_event'],
                    eventRequest: settings['event_request'],
                    eventInvitation: settings['event_invitation']
                    })
            }else{
                this.setState({
                    isLoaded: true,
                    error_data: data.error
                })
            }
        })   
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.checked;
        this.setState({
            [name]: value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let setting = {};

        setting.email_notification = this.state.emailNotification;
        setting.telegram_notification = this.state.telegramNotification;
        setting.viber_notification = this.state.viberNotification;
        setting.request_approved = this.state.requestApproved;
        setting.request_rejected = this.state.requestRejected;
        setting.is_kicked = this.state.isKicked;
        setting.event_finished = this.state.eventFinished;
        setting.event_canceled = this.state.eventCanceled;
        setting.received_feedback = this.state.receivedFeedback;
        setting.before_event = this.state.beforeEvent;
        setting.event_request = this.state.eventRequest;
        setting.event_invitation = this.state.eventInvitation;

        fetch('http://localhost:5999/settings',
            {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({setting})
            }
        )
            .then(response => response.json())
            .then(response => console.log(response))
    };

    render(){
        if(this.state.isLoaded){
            if(this.state.error_data.message==="UNAUTHORIZED_USER"){
                return(
                    this.notAutorizedUser() 
                )
            }else{
                return(
                    this.isUser()
                )
            }
        }else{
            return(
                <div>
                    <div className="spinner-grow text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
        
}
}
