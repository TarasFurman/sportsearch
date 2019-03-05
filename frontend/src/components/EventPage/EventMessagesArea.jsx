import React from 'react'

import EventMessage from './EventMessage'

export class EventMessagesArea extends React.Component {
    
    render() {
        return(
            <div style={{
                border: "1px solid #f39c12",
            }}>
                <ul className="list-group" style={{
                    maxHeight: "50vh",
                    overflow: "auto",
                }}>
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