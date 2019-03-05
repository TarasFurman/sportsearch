import React from 'react'

import SearchEventMember from './SearchEventMember'

export class SearchEventMembersArea extends React.Component {

    render() {
        return(
            <>
                <h3 style={{
                    margin: "1vmin",
                    marginBottom: "2vmin",
                    borderBottom: "1px solid #1abc9c",
                }}>
                    Invite users
                    <span style={{
                        float: "right",
                        fontStyle: "italic",
                        fontSize: "0.5em",
                        borderLeft: "1px solid #3498db",
                        borderBottom: "1px solid #3498db",
                        paddingLeft: "1vmin",
                    }}>
                        Users found: { this.props.members.length }
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
                    { this.props.members.map(member => (
                        <li key={ member.id } style={{
                            paddingBottom: "0",
                        }}>
                            <SearchEventMember 
                                requestMember={ member }
                                inviteMember={ this.props.inviteMember }
                                eventMinAge={ this.props.eventMinAge }
                                eventMaxAge={ this.props.eventMaxAge } />
                        </li>
                    )) }
                </ul>
            </>
        );
    }
}

export default SearchEventMembersArea;