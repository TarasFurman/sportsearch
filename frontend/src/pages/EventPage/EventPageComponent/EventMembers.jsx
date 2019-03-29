import React from 'react'
import io from 'socket.io-client'

import ActiveEventMembers from './ActiveEventMembers'
import RequestEventMembers from './RequestEventMembers'
import SearchEventMembers from './SearchEventMembers'

export class EventMembers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            showActiveMembers: true,
            showSearchMembers: false,
        }

        this.activeMembersButton = this.activeMembersButton.bind(this);
        this.searchMembersButton = this.searchMembersButton.bind(this);
    }

    activeMembersButton() {
        return(
            <button type="button" className="btn btn-outline-info btn-sm mx-1"
                onClick={() => { this.setState({ showActiveMembers: !this.state.showActiveMembers }) }}>
            { this.state.showActiveMembers ? "Membership requests" : "Active members" }
            </button>
        )
    }

    searchMembersButton() {
        return(
            <button type="button" className="btn btn-outline-dark btn-sm mx-1"
                onClick={() => { this.setState({ showSearchMembers: !this.state.showSearchMembers }) }}>
            { this.state.showSearchMembers ? "Close search" : "Search users" }
            </button>
        )
    }

    render() {
        var socket = io("http://localhost:5999/members");

        return(
            <>
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12" style={{
                    border: "1px solid #27ae60",
                }}>
                    { this.props.ownerId === this.props.userId ? 
                        this.state.showSearchMembers && this.props.eventStatus === 1 ?
                            <SearchEventMembers 
                                eventId={ this.props.eventId }
                                eventMinAge={ this.props.eventMinAge }
                                eventMaxAge={ this.props.eventMaxAge } /> :
                            this.state.showActiveMembers ?
                                <ActiveEventMembers 
                                    eventId={ this.props.eventId }
                                    eventStatus={ this.props.eventStatus }
                                    userId={ this.props.userId }
                                    ownerId={ this.props.ownerId }
                                    membersTotal={ this.props.membersTotal }
                                    membersNeeded={ this.props.membersNeeded }
                                    socket={ socket } /> 
                            :   <RequestEventMembers
                                    eventId={ this.props.eventId }
                                    userId={ this.props.userId }
                                    eventStatus={ this.props.eventStatus }
                                    eventMinAge={ this.props.eventMinAge }
                                    eventMaxAge={ this.props.eventMaxAge }
                                    socket={ socket } />
                                                    : <ActiveEventMembers 
                                                        eventId={ this.props.eventId }
                                                        eventStatus={ this.props.eventStatus }
                                                        userId={ this.props.userId }
                                                        ownerId={ this.props.ownerId }
                                                        membersTotal={ this.props.membersTotal }
                                                        membersNeeded={ this.props.membersNeeded }
                                                        socket={ socket } />  }
                </div>
                <div className="col-xl-1 col-lg-2 col-md-2 col-sm-12 text-center">
                    { this.props.ownerId === this.props.userId ? this.activeMembersButton() : ""}
                    <hr/>
                    { this.props.ownerId === this.props.userId ? this.searchMembersButton() : ""}
                </div>
            </>
        );
    }
}

export default EventMembers;