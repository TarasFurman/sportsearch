import React, {Component} from 'react';
import Events from '../components/Events/Events'
import CheckboxFilters from '../components/Events/CheckboxFilters'

export default class EventsPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            eventData: [],
            error_data: {},
            isLoaded:false,
            football:false,
            basketball:false,
            volleyball:false,
            chess:false,
            ping_pong:false,
            other:false,
            owner:false,
            not_owner:false,
            waiting:false,
            approved:false,
            rejected:false,
            kicked:false
        }         
    }

    isUser(){
        let events = this.state.eventData.map(event => 
            <Events
                id={event.id}
                key={event.id}
                name={event.name}
                sport={event.sport_name}
                image_url={event.image_url}
                start_time={event.start_time}
                end_time={event.end_time}
                price={event.price}
                age_from={event.age_from}
                age_to={event.age_to}
                status={event.status}
                members_total={event.members_total}
                members_needed={event.members_needed}
                owner_id={event.owner_id}
                address={event.address}
                user_status={event.user_in_event_status} />
        )
        return(
            <div>
                <CheckboxFilters 
                    handleInputChange={this.handleInputChange}
                    football={this.state.football}
                    basketball={this.state.basketball}
                    volleyball={this.state.volleyball}
                    chess={this.state.chess}
                    ping_pong={this.state.ping_pong}
                    other={this.state.other}
                    owner={this.state.owner}
                    not_owner={this.state.not_owner}
                    waiting={this.state.waiting}
                    approved={this.state.approved}
                    rejected={this.state.rejected}
                    kicked={this.state.kicked}
                    />
                <h2>List of your events</h2>
                {events}
            </div>
        )
    }

    notAutorizedUser() {
        return(
            <div className={'notAutorized'}>
                <h1>
                    You do not have an access to this page. Please 
                    <br/> 
                    <p><a href="http://localhost:5998/signup"> Sign up </a>  or  <a href="http://localhost:5998/signin"> Sign in </a></p>
                </h1>
            </div>
        );
    }

    zeroEvents() {
        return(
            <div className={'zeroEvents'}>
                <CheckboxFilters 
                    handleInputChange={this.handleInputChange}
                    football={this.state.football}
                    basketball={this.state.basketball}
                    volleyball={this.state.volleyball}
                    chess={this.state.chess}
                    ping_pong={this.state.ping_pong}
                    other={this.state.other}
                    owner={this.state.owner}
                    not_owner={this.state.not_owner}
                    waiting={this.state.waiting}
                    approved={this.state.approved}
                    rejected={this.state.rejected}
                    kicked={this.state.kicked}
                    />
                <h1>You don't have any events yet</h1>
            </div>
        )
    }

    componentDidMount() {

        fetch("http://localhost:5999/my-events",
        {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        }
        ).then(response => response.json())
        .then(data=> {
            if(data['code']===200){
                console.log("OK")
                this.setState({
                    eventData: data.events_data,
                    isLoaded: true
                })
            }else{
                this.setState({
                    error_data: data.error,
                    isLoaded: true 
                })
            }
        })
    }

    handleInputChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.checked
        this.setState({
            [name]: value
        }, () => {
            let filters = {}

            filters.football = this.state.football
            filters.basketball = this.state.basketball
            filters.volleyball = this.state.volleyball
            filters.chess = this.state.chess
            filters.ping_pong = this.state.ping_pong
            filters.other = this.state.other
            filters.owner = this.state.owner
            filters.not_owner = this.state.not_owner
            filters.waiting = this.state.waiting
            filters.approved = this.state.approved
            filters.rejected = this.state.rejected
            filters.kicked = this.state.kicked
            console.log(filters)
            fetch("http://localhost:5999/my-events",
                {
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    body: JSON.stringify({filters})
                }
            )
                .then(response => response.json())
                // .then(response => console.log(response))
                .then(data=> {
                    if(data['code']===200){
                        console.log("OK")
                        this.setState({
                            eventData: data.events_data
                        })
                    }
                })
        });        
    }

    render(){
        if(this.state.isLoaded){
            if(this.state.eventData.length){
                return this.isUser()
            }else if(this.state.error_data.message==="UNAUTHORIZED_USER"){
                return(
                   this.notAutorizedUser() 
                )
            }else if(this.state.eventData.length===0 && !this.state.error_data.message){
                return this.zeroEvents() 
            }  
        }else {
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
