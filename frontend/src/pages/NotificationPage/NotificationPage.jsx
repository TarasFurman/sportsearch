import React from 'react';
import Notification from './Notification/Notification'

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
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
    

        let notifications = this.state.notifications.map(notification  =>
        {    
            if(notification.seen === true)
                return <Notification
                    id={notification.id} 
                    key={notification.id}
                    eventId={notification.event_name}
                    notificationType={notification.notification_message}
                    seen={notification.seen}
                    seenClick={this.seenClick}
                />
        });
        return (
            <div>{notifications}</div>
            
        )
    }

    seenClick = id => { 
        let notifications = [...this.state.notifications];
        let index = notifications.findIndex(el => el.id === id);
        notifications[index] = {...notifications[index], seen: false};
        let obj = notifications[index]

        fetch('http://localhost:5999/notification',
        {
          headers:{
              'Content-Type': 'application/json'
          },
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({obj})
        })
        .then(response => response.json()) 
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



