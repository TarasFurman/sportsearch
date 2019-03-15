import React from 'react'

import EventMessage from './EventMessage'

export class EventMessagesArea extends React.Component {
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
            this.props.forthMessages();
         }
    }
    
    render() {
        return(
            <div style={{
                border: "1px solid #f39c12",
            }}>
                <ul className="list-group" style={{
                    maxHeight: "50vh",
                    overflow: "auto",
                }} onScroll={ this.handleScroll }>
                    { this.props.messages.map(message => (
                        <li className="list-group-item border-0" key={ message.id } style={{ margin: "0", padding: "0" }}>
                            <EventMessage 
                                message={ message }
                                thisMemberMessage={ message.sender_id === this.props.userId }
                                thisAdminMessage={ message.sender_id === this.props.ownerId } />
                            <hr style={{ 
                                maxWidth: "50%",
                                color: "#1abc9c",
                                margin: "0",
                            }}/>
                        </li>
                    )) }
                </ul>
            </div>
        );
    }

}

export default EventMessagesArea;