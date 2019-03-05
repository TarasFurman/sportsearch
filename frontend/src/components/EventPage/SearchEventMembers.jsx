import React from 'react'

import SearchEventMembersArea from './SearchEventMembersArea'
import SearchEventMembersForm from './SearchEventMembersForm'

export class RequestEventMembers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            members: [],
            isLoaded: false,
        }

        this.getMembers = this.getMembers.bind(this);
        this.inviteMember = this.inviteMember.bind(this);
    }

    getMembers(nick) {
        fetch("http://localhost:5999/search-members/" + this.props.eventId + "?nickname=" + nick)
        .then(response => response.json())
        .then(data => {
            this.setState({
                members: data.members,
                isLoaded: true,
            })
        });
    }

    inviteMember(memberId) {
        fetch('http://localhost:5999/invite-member/' + this.props.eventId, {
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
                <SearchEventMembersForm onSubmit={ this.getMembers } />
                <SearchEventMembersArea 
                    members={ this.state.members }
                    eventMinAge={ this.props.eventMinAge }
                    eventMaxAge={ this.props.eventMaxAge }
                    inviteMember={ this.inviteMember } />
            </>
        );
    }
}

export default RequestEventMembers;