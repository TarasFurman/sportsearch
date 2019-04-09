import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import './events.css'

export default class Events extends Component {
    
    render(){
        return(
            <Link className='link' to={"/event/" + this.props.id}>
                <table className="eventsTable">
                    <thead>
                        <tr className='tableHead'>
                        <th className={'events-center'}>Image</th>
                        <th className={'events-center'}>Name of event</th>
                        <th className={'events-center'}>Sport</th>
                        <th className={'events-center'}>Start time</th>
                        <th className={'events-center'}>End time</th>
                        <th className={'events-center'}>Price</th>
                        <th className={'events-center'}>Age from</th>
                        <th className={'events-center'}>Age to</th>
                        <th className={'events-center'}>User status</th>
                        <th className={'events-center'}>Members total</th>
                        <th className={'events-center'}>Members needed</th>
                        <th className={'events-center'}>Owner</th>
                        <th className={'events-center'}>Event status</th>
                        <th className={'events-center'}>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td><img className="photoIcon" src={this.props.image_url} alt={"event"} /></td>
                        <td><p>{this.props.name}</p></td>
                        <td><p>{this.props.sport}</p></td>
                        <td><p>{this.props.start_time}</p></td>
                        <td><p>{this.props.end_time}</p></td>
                        <td><p>{this.props.price}</p></td>
                        <td><p>{this.props.age_from}</p></td>
                        <td><p>{this.props.age_to}</p></td>
                        <td><p>{this.props.status}</p></td>
                        <td><p>{this.props.members_total}</p></td>
                        <td><p>{this.props.members_needed}</p></td>
                        <td><p>{this.props.owner}</p></td>
                        <td><p>{this.props.event_status}</p></td>
                        <td><p>{this.props.address}</p></td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        )
    }
}