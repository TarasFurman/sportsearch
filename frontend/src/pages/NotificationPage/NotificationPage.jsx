import React from 'react';
import Notification from './Notification/Notification'

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: '',
        };

    }

    createNotification() {
        fetch('http://localhost:5999/notification',
        {
          headers:{
              'Content-Type': 'application/json'
          },
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        })
        .then(response => response.json())
        .then(response => {
          if (response['code'] === 200){
            this.setState({
                notifications: response['notifications']
            });
          }
        })


        let notifications = this.props.notifications.map(notification =>
        <Notification
            key={this.props.notification.id}
            eventId={this.props.notification.event_name}
            notificationType={this.props.notification.notification_message}
        />);
        return (
            <div>{notifications}</div>
        )
    }

    render() {
        return (
            <div className="notificationsWrapper">
                Notifications
                {this.createNotification()}
            </div>
        );
    }
}

export default Index;



