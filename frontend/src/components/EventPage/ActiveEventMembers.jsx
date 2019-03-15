import React from 'react'

import ActiveEventMember from './ActiveEventMember'

export class ActiveEventMembers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            members: [],
            isLoaded: false,
        }

        this.kickMember = this.kickMember.bind(this);
        this.rateMember = this.rateMember.bind(this);
    }

    getMembers() {
        fetch("http://localhost:5999/event-members/" + this.props.eventId,
        {
            mode: "cors",
            credentials: "include",
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                members: data.members,
                isLoaded: true,
            })
        });
    }

    kickMember(memberId) {
        fetch('http://localhost:5999/kick-user/' + this.props.eventId, {
            mode: "cors",
            credentials: "include",
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "kick_user_id": memberId
            })
        })
        .then(() => this.getMembers());
    }

    rateMember(memberId, mark, comment) {
        fetch('http://localhost:5999/rate-user/' + this.props.eventId, {
            mode: "cors",
            credentials: "include",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                target_user_id: memberId,
                mark: mark,
                comment: comment,
            })
        })
        .then(() => this.getMembers());
    }

    componentDidMount() {
        this.getMembers();
        this.interval = setInterval(() => this.getMembers(), 60000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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