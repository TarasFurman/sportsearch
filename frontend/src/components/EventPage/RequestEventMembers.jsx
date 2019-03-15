import React from 'react'

import RequestEventMember from './RequestEventMember'

export class RequestEventMembers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            members: [],
            isLoaded: false,
        }

        this.grandMember = this.grandMember.bind(this);
    }

    getMembers() {
        fetch("http://localhost:5999/request-members/" + this.props.eventId,
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

    grandMember(memberId, memberStatus) {
        fetch('http://localhost:5999/request-member/' + this.props.eventId, {
            mode: "cors",
            credentials: "include",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "target_user_id": memberId,
                "target_user_status": memberStatus
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
                        Membersip requests
                        <span style={{
                            float: "right",
                            fontStyle: "italic",
                            fontSize: "0.5em",
                            borderLeft: "1px solid #3498db",
                            borderBottom: "1px solid #3498db",
                            paddingLeft: "1vmin",
                        }}>
                            Requests: { this.state.members.length }
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
                                <RequestEventMember 
                                    requestMember={ member }
                                    eventStatus={ this.props.eventStatus }
                                    grandMember={ this.grandMember }
                                    eventMinAge={ this.props.eventMinAge }
                                    eventMaxAge={ this.props.eventMaxAge } />
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

export default RequestEventMembers;