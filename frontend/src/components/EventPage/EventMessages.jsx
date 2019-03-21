import React from 'react'
import io from 'socket.io-client'

import EventMessageArea from './EventMessagesArea'
import EventMessageForm from './EventMessageForm'

var socket;

export class EventMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            limit: 5,
            messages: [],
            isLoaded: false,
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.getMessages = this.getMessages.bind(this);
    }

    sendMessage(text) {
        socket.emit(
            "send_message",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
                "text": text,
            }
        );
    }

    getMessages() {
        socket.emit(
            "request_messages",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
                "limit": this.state.limit,
                "offset": this.state.offset,
            }
        );
    }

    componentDidMount() {
        socket = io("http://localhost:5999/chat");

        socket.on(
            "receive_messages",
            response => this.setState(prevState => ({
                messages: [...prevState.messages, ...response.messages],
                offset: this.state.offset + response.messages.length,
                isLoaded: true,
            }))
        );
        socket.on(
            "receive_message",
            response => this.setState(prevState => ({
                messages: [response.message, ...prevState.messages],
                offset: this.state.offset + 1,
            }))
        );

        // Join a group
        socket.emit(
            "join",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
            }
        );


        // We need to listen to the messages at first, and just then
        // go on and send a request to get a bunch of messages
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
        socket.emit(
            "leave",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
            }
         );
        socket.off("receive_message");
        socket.off("receive_messages");
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
                        ownerId={ this.props.ownerId }
                        forthMessages={ this.getMessages } />
                </div>
            );
        }
        else {
            return(
                <div>
                    {[1, 4].includes(this.props.eventStatus) ?
                        <EventMessageForm onSubmit={ this.sendMessage } /> : ""}
                    <hr/>
                    <div className="spinner-grow text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
    }
}

export default EventMessage;