import React from 'react'
import { Link } from 'react-router-dom'

import EventInfo from '../EventPage/EventPageComponent/EventInfo'
import EventMembers from '../EventPage/EventPageComponent/EventMembers'
import EventMessages from '../EventPage/EventPageComponent/EventMessages'

export class EventPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user_data: {},
            event_data: {},
            error_data: {},
            isLoaded: false,
        };

        this.leaveEvent = this.leaveEvent.bind(this);
        this.cancelEvent = this.cancelEvent.bind(this);
    }


    wrongauthorizedUserError() {
        return(
            <div>
                <h1 className="text-center">
                    You do not have an access to this event. :)
                    <br/>
                    <Link to="/signup/"> Register! </Link>
                </h1>
            </div>
        );
    }

    wrongunauthorizedUserError() {
        return(
            <div>
                <h1 className="text-center">
                    You are not registered in this event or your request
                    is waiting to be approved by admin.
                </h1>
            </div>
        );
    }

    anotherError() {
        return(
            <div>
                <h1 className="text-center">
                    Some error was occurred, try to reload this page.
                    <br/>
                    Status code: { this.state.error_data.status }
                </h1>
            </div>
        );
    }

    rightUser() {
        var data = this.state.event_data;
        var status_name = data.status;
        return(
            <div className="container-fluid" style={{
                marginBottom: "5vh",
            }}>
                <hr/>
                <h1 className="text-center mx-auto">
                    <span className={ status_name === "Planned" ? "badge badge-success" :
                                    status_name === "Canceled" ? "badge badge-danger" :
                                    status_name === "Finished" ? "badge badge-dark" :
                                    status_name === "In action" ? "badge badge-warning" :
                                                                  "badge badge-primary" }>
                        { status_name }
                    </span>
                </h1>
                <hr/>
                <div className="container-fluid mx-2">
                    <div className="row no-gutters">
                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12" style={{
                            border: "1px solid #a29bfe",
                            padding: "2vmin",
                            // paddingLeft: "0",
                        }}>
                            <EventInfo
                                eventInfo={ data }
                                isOwner={ data.owner_id === this.state.user_data.id }
                                leaveEvent={ this.leaveEvent }
                                cancelEvent={ this.cancelEvent } />
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                            {/* <Map lat={ data.lng }
                                lng={ data.lat }/> */}
                            {/* <Map marker={{
                                lat: info.lng,
                                lng: info.lat,
                            }} /> */}
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="container-fluid mt-2">
                    <div className="row no-gutters">
                        <EventMembers
                            eventId={ this.props.match.params.eventId }
                            eventStatus={ this.state.event_data.status_id }
                            userId={ this.state.user_data.id }
                            ownerId={ data.owner_id }
                            membersTotal={ data.members_total }
                            membersNeeded={ data.members_needed }
                            eventMinAge={ this.state.event_data.age_from }
                            eventMaxAge={ this.state.event_data.age_to } />
                        <div className="col-xl-7 col-lg-6 col-md-6 col-sm-12">
                            <EventMessages
                                eventId={ this.props.match.params.eventId }
                                eventStatus={ this.state.event_data.status_id }
                                userId={ this.state.user_data.id }
                                ownerId={ data.owner_id } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    leaveEvent() {
        fetch("http://localhost:5999/event/" + this.props.match.params.eventId + "/leave",
        {
            mode: "cors",
            credentials: "include",
        })
        .then(() => window.location.reload());
    }

    cancelEvent() {
        fetch("http://localhost:5999/event/" + this.props.match.params.eventId + "/cancel",
        {
            mode: "cors",
            credentials: "include",
        })
        .then(() => window.location.reload());
    }

    componentDidMount() {
        fetch(
            "http://localhost:5999/event/" + this.props.match.params.eventId + "/info",
            {
                mode: "cors",
                credentials: "include",
            })
            .then(
                response => response.json())
            .then(data => {
                this.setState({
                user_data: data.user_data,
                event_data: data.event_data,
                error_data: data.error,
                isLoaded: true,
            })})
            .catch(() => {});
    }

    render() {
        if (this.state.isLoaded) {
            if (this.state.user_data && this.state.event_data) {
                return this.rightUser()
            }
            else {
                if (this.state.error_data.message === "UNAUTHORIZED_USER")
                    return this.wrongunauthorizedUserError()
                else if (this.state.error_data.message === "USER_FORBIDDEN")
                    return this.wrongauthorizedUserError()
                else
                    return this.anotherError()
            }
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

export default EventPage;