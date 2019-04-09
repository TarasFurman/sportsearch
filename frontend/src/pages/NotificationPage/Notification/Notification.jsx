import React from 'react';

class Index extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="card">
                <div className="content">
                    <h6>{this.props.eventId}</h6>
                    <span>{this.props.notificationType}{" "}{this.props.seen}</span>
                </div>

                <button onClick={() => this.props.seenClick(this.props.id)}>Ok</button>
            </div>
        )
    }
}

export default Index;





