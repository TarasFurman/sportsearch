import React from 'react';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        
        };

    }

    render() {
        return (
            <div className="card">
                <div className="content">
                    <h6>{this.props.eventId}</h6>
                    {this.props.notificationType}
                </div>
            </div>
        )
    }
}

export default Index;





