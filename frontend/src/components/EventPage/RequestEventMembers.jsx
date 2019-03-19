import React from 'react'
import io from 'socket.io-client'

import RequestEventMember from './RequestEventMember'

var socket;

export class RequestEventMembers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            members: [],
            isLoaded: false,
        }

        this.grantMember = this.grantMember.bind(this);
        this.getMembers = this.getMembers.bind(this);
    }

    getMembers() {
        socket.emit(
            "get_request_users",
            { 
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
            }
        )
    }

    grantMember(memberId, memberStatus) {
        socket.emit(
            "grant_user",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
                "target_user_id": memberId,
                "target_user_status": memberStatus
            }
        );

        this.getMembers();

        if (memberStatus === 2) {
            socket.emit(
                "get_active_members",
                { 
                    "event_id": this.props.eventId,
                    "user_id": this.props.userId,
                    "update_all_users": true,
                }
            );
        }
    }

    componentDidMount() {
        socket = io("http://localhost:5999/members");

        socket.on(
            "receive_request_members",
            response => this.setState({
                        members: response.members,
                        isLoaded: true,
                    })
        );
        
        socket.emit(
            "join", 
            { 
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
            }
        );

        this.getMembers();
    }

    componentWillUnmount() {
        socket.emit(
            "leave", 
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
            }
        );
        socket.off("receive_request_members");
    }

    render() {
        if (this.state.isLoaded) {
            return(
                <>
                    <h3 style={{
                        margin: "1vmin",
                        marginBottom: "2vmin",
                        borderBottom: "1px solid #1abc9c",
                    }}>
                        Membersip requests
                        <span style={{
                            float: "right",
                            fontStyle: "italic",
                            fontSize: "0.5em",
                            borderLeft: "1px solid #3498db",
                            borderBottom: "1px solid #3498db",
                            paddingLeft: "1vmin",
                        }}>
                            Requests: { this.state.members ? this.state.members.length : 0 }
                        </span>
                    </h3>
    
                    
                    <ul style={{
                        maxHeight: "50vh",
                        overflow: "auto",
                        listStyleType: "none",
                        margin: "0",
                        padding: "0",
                        width: "100%",
                    }}>
                        { this.state.members ? this.state.members.map(member => (
                            <li key={ member.id } style={{
                                paddingBottom: "0",
                            }}>
                                <RequestEventMember 
                                    requestMember={ member }
                                    eventStatus={ this.props.eventStatus }
                                    grantMember={ this.grantMember }
                                    eventMinAge={ this.props.eventMinAge }
                                    eventMaxAge={ this.props.eventMaxAge } />
                            </li>
                        )) : <h6>Data was not loaded, click on button twice again, please :#)</h6> }
                    </ul>
                </>
            );
        }
        else {
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

export default RequestEventMembers;