import React from 'react'

import EventMessageArea from './EventMessagesArea'
import EventMessageForm from './EventMessageForm'

export class EventMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            limit: 0,
            messages: [],
            isLoaded: false,
        };
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(text) {
        fetch("http://localhost:5999/event-message/" + this.props.eventId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": text
            })
        })
        .then(() => this.getnewMessages(this.state.messages.length === 0 ?
            new Date().toISOString().slice(1) :
            this.state.messages[0].message_time));
    }

    getnewMessages(lastdate) {
        fetch("http://localhost:5999/new-event-messages/" + this.props.eventId + "?last_time=" + lastdate)
        .then(response => response.json())
        .then(data => data.messages)
        .then(data => {
            this.setState({
                messages: [...data, ...this.state.messages],
                offset: this.state.offset + data.length,
                isLoaded: true,
            })
        })
        .catch(error => console.log("error", error));
    }

    getMessages() {
        fetch("http://localhost:5999/event-messages/" + this.props.eventId)
        .then(response => response.json())
        .then(data => data.messages)
        .then(data => {
            this.setState({
                messages: this.state.messages.concat(data),
                offset: this.state.offset + this.state.limit,
                isLoaded: true,
            })
        })
        .catch(error => console.log("error", error));
    }

    componentDidMount() {
        this.getMessages();
        if ([1, 4].includes(this.props.eventStatus)) {
            this.interval = setInterval(() => this.getnewMessages(
                this.state.messages.length === 0 ?
                        new Date().toISOString().slice(1) :
                        this.state.messages[0].message_time
                ), 3000)
        }
    }

    componentWillUnmount() {
        if ([1, 4].includes(this.props.eventStatus)) {
            clearInterval(this.interval);
        }
    }

    render() {
        if (this.state.isLoaded){
            return(
                <div>
                    {[1, 4].includes(this.props.eventStatus) ? 
                        <EventMessageForm onSubmit={ this.sendMessage } /> : ""}
                    <hr/>
                    <EventMessageArea 
                        messages={ this.state.messages }
                        userId={ this.props.userId }
                        ownerId={ this.props.ownerId } />
                </div>
            );
        }
        else {
            return(
                <div>
                    <div className="spinner-grow text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
    }
}

export default EventMessage;