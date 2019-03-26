import React from 'react'

import SearchEventMember from './SearchEventMember'

export class SearchEventMembersArea extends React.Component {

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll(e) {
        e.preventDefault();
        // On some systems, scrollTop gives a Decimal value, so we need to check not for strict equality itself,
        // but for equality of an ceil or floor of that number (we can't predict what value it'll get (<> 0.5))
        var bottom = Math.floor(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight
            || Math.ceil(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight;
        if (bottom) { 
            this.props.getMembers(false);
         }
    }

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
                }} onScroll={ this.handleScroll }>
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