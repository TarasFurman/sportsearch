import React from 'react';
import './notification.css'

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <div className="content">
                    <h2>Event: {this.props.eventId}</h2>
                    <h6>Notification: {this.props.notificationType}{" "}{this.props.seen}</h6>
                </div>
                <div className="rightContent">
                    <button className="notificationSubmit" onClick={() => this.props.seenClick(this.props.id)}>Ok</button>
                </div>
            </div>
        )
    }
}

export default Index;





