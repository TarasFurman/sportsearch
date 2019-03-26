import React from 'react';

class Settings extends React.Component{
    constructor(props){
        super(props);
        this.state={
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
            eventInvitation: false
        }
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

        fetch('http://localhost:5999/save_setting',
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
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <h1>Notifications could be sent to:</h1>
                    <br/><br/>
                    Email
                    <input
                        name="emailNotification"
                        type="checkbox"
                        checked={this.state.emailNotification}
                        onChange={this.handleInputChange}
                    />
                    Telegram
                    <input
                        name="telegramNotification"
                        type="checkbox"
                        checked={this.state.telegramNotification}
                        onChange={this.handleInputChange}
                    />
                    Viber
                    <input
                        name="viberNotification"
                        type="checkbox"
                        checked={this.state.viberNotification}
                        onChange={this.handleInputChange}
                    />


                    <h1>Type notification:</h1>
                    <br/><br/>
                    Your request has been approved
                    <input
                        name="requestApproved"
                        type="checkbox"
                        checked={this.state.requestApproved}
                        onChange={this.handleInputChange}
                    /><br/>
                    Your request has been rejected
                    <input
                        name="requestRejected"
                        type="checkbox"
                        checked={this.state.requestRejected}
                        onChange={this.handleInputChange}
                    /><br/>
                    You have been kicked from event
                    <input
                        name="isKicked"
                        type="checkbox"
                        checked={this.state.isKicked}
                        onChange={this.handleInputChange}
                    /><br/>
                    Event finished
                    <input
                        name="eventFinished"
                        type="checkbox"
                        checked={this.state.eventFinished}
                        onChange={this.handleInputChange}
                    /><br/>
                    Event canceled
                    <input
                        name="eventCanceled"
                        type="checkbox"
                        checked={this.state.eventCanceled}
                        onChange={this.handleInputChange}
                    /><br/>
                    You received feedback
                    <input
                        name="receivedFeedback"
                        type="checkbox"
                        checked={this.state.receivedFeedback}
                        onChange={this.handleInputChange}
                    /><br/>
                    1 hour before the event
                    <input
                        name="beforeEvent"
                        type="checkbox"
                        checked={this.state.beforeEvent}
                        onChange={this.handleInputChange}
                    /><br/>
                    When new request appears (for event owners only)
                    <input
                        name="eventRequest"
                        type="checkbox"
                        checked={this.state.eventRequest}
                        onChange={this.handleInputChange}
                    /><br/>
                    You were invited to the event 
                    <input
                        name="eventInvitation"
                        type="checkbox"
                        checked={this.state.eventInvitation}
                        onChange={this.handleInputChange}
                    /><br/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}


export default Settings;
