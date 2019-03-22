import React from 'react'
import io from 'socket.io-client'

import ActiveEventMember from './ActiveEventMember'

var socket;

export class ActiveEventMembers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            members: [],
            isLoaded: false,
        }

        this.rateMember = this.rateMember.bind(this);
        this.kickMember = this.kickMember.bind(this);
        this.updateActiveMembers = this.updateActiveMembers.bind(this);
    }

    updateActiveMembers(toAll) {
        socket.emit(
            "get_active_members",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
                "update_all_users": toAll,
            }
        );
    }

    kickMember(memberId) {
        socket.emit(
            "kick_member",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
                "kick_user_id": memberId,
            }
        );

        this.updateActiveMembers(true);
    }

    rateMember(memberId, mark, comment) {
        socket.emit(
            "rate_user",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
                "target_user_id": memberId,
                "mark": mark,
                "comment": comment,
            }
        );

        this.updateActiveMembers(false);
    }

    componentDidMount() {
        socket = io("http://localhost:5999/members");

        socket.on(
            "receive_active_members",
            response => this.setState({
                members: response.members,
                isLoaded: true,
            })
        );

        // Join a group
        socket.emit(
            "join",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
            }
        );

        this.updateActiveMembers(false);
    }

    componentWillUnmount() {
        socket.emit(
            "leave",
            {
                "event_id": this.props.eventId,
                "user_id": this.props.userId,
            }
        );
        socket.off("receive_active_members");
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
                        Members
                        <span style={{
                            float: "right",
                            fontStyle: "italic",
                            fontSize: "0.5em",
                            borderLeft: "1px solid #3498db",
                            borderBottom: "1px solid #3498db",
                            paddingLeft: "1vmin",
                        }}>
                            { this.state.members.length } of { this.props.membersNeeded } needed
                            ({ this.props.membersTotal - this.props.membersNeeded } external)
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
                        { this.state.members.map(member => (
                            <li key={ member.id } style={{
                                paddingBottom: "0",
                            }}>
                                <ActiveEventMember 
                                    eventMember={ member }
                                    eventStatus={ this.props.eventStatus }
                                    isMember={ this.props.userId === member.id }
                                    isAdmin={ this.props.ownerId === member.id }
                                    userisAdmin={ this.props.ownerId === this.props.userId }
                                    kick={ this.kickMember }
                                    rate={ this.rateMember } />
                            </li>
                        )) }
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

export default ActiveEventMembers;