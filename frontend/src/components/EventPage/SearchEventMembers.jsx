import React from 'react'

import SearchEventMembersArea from './SearchEventMembersArea'
import SearchEventMembersForm from './SearchEventMembersForm'

export class RequestEventMembers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            members: [],
            nick: "",
            limit: 5,
            offset: 0,
            isLoaded: false,
        }

        this.getMembers = this.getMembers.bind(this);
        this.inviteMember = this.inviteMember.bind(this);
        this.changeNick = this.changeNick.bind(this);
    }

    changeNick(nickname) {
        this.setState({
            nick: nickname,
            offset: 0,
            isLoaded: false,
        }, () => this.getMembers(true) );
    }

    getMembers(haschanged) {
        fetch("http://localhost:5999/event/" + this.props.eventId + "/users/search" 
            + "?nickname=" + this.state.nick 
            + "&limit=" + this.state.limit
            + "&offset=" + this.state.offset,
        {
            mode: "cors",
            credentials: "include",
        })
        .then(response => response.json())
        .then(data => data.members)
        .then(data => {
            this.setState({
                members: haschanged ? 
                            data ? data : []
                            : [...this.state.members, ...data],
                offset: this.state.offset + data.length,
            })
        })
        .catch(error => console.log("error", error));
    }

    inviteMember(memberId) {
        fetch('http://localhost:5999/event/' + this.props.eventId + "/user/invite", {
            mode: "cors",
            credentials: "include",    
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "invite_user_id": memberId
            })
        })
        .then(() => this.setState({ members: [] }));
    }

    render() {
        return(
            <>
                <SearchEventMembersForm 
                    changeNick={ this.changeNick } />
                <SearchEventMembersArea 
                    members={ this.state.members }
                    eventMinAge={ this.props.eventMinAge }
                    eventMaxAge={ this.props.eventMaxAge }
                    inviteMember={ this.inviteMember }
                    getMembers={ this.getMembers } />
            </>
        );
    }
}

export default RequestEventMembers;