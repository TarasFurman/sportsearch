import React, {Component} from 'react';
import { Table } from 'react-bootstrap';
import './events.css'

export default class Events extends Component {
    
    render(){
        return(
            <a className={'link'} href={'http://localhost:5999/event/' + this.props.id}>
            <table className="eventsTable">
                    <thead>
                        <tr>
                        <th>Image</th>
                        <th className={'center'}>Name of event</th>
                        <th className={'center'}>Sport</th>
                        <th className={'center'}>Start time</th>
                        <th className={'center'}>End time</th>
                        <th className={'center'}>Price</th>
                        <th className={'center'}>Age from</th>
                        <th className={'center'}>Age to</th>
                        <th className={'center'}>Event status</th>
                        <th className={'center'}>Members total</th>
                        <th className={'center'}>Members needed</th>
                        <th className={'center'}>Owner</th>
                        <th className={'center'}>User status</th>
                        <th className={'center'}>Address</th>
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
                        <td><p>{this.props.owner_id}</p></td>
                        <td><p>{this.props.user_status}</p></td>
                        <td><p>{this.props.address}</p></td>
                        </tr>
                    </tbody>
                </table>
            </a>
            
        )
    }
}