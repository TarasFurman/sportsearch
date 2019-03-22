import React, { Component } from "react";
import "./events.css";

export default class CheckboxFilters extends Component {
  
  render() {
    return (
      <form className="filterForm">
        <div className="sportType sport1">
          <h4>Sport type</h4>
          <div className="sportTypeFilters">
            <label className="filterContainer">
            <span>Football</span>
            <input className="filterInput"
            name="football"
            label="football1"
            type="checkbox"
            checked={this.props.football}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Basketball
            <input className="filterInput"
            name="basketball"
            type="checkbox"
            checked={this.props.basketball}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Volleyball
            <input className="filterInput"
            name="volleyball"
            type="checkbox"
            checked={this.props.volleyball}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Chess
            <input className="filterInput"
            name="chess"
            type="checkbox"
            checked={this.props.chess}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Ping pong
            <input className="filterInput"
            name="ping_pong"
            type="checkbox"
            checked={this.props.ping_pong}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Other
            <input className="filterInput"
            name="other"
            type="checkbox"
            checked={this.props.other}
            onChange={this.props.handleInputChange}
            />
            
            </label>
          </div>
        </div>
        <div className="sportType sport2">
          <h4>Is owner</h4>
          <div className={'sportTypeFilters'}>
            <label className="filterContainer">Owner
            <input className="filterInput"
            name="owner"
            type="checkbox"
            checked={this.props.owner}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Not owner
            <input className="filterInput"
            name="not_owner"
            type="checkbox"
            checked={this.props.not_owner}
            onChange={this.props.handleInputChange}
            />
            
            </label>
          </div>
        </div>
        <div className="sportType sport3">
          <h4>User status</h4>
          <div className={'sportTypeFilters'}>
            <label className="filterContainer">Waiting for approving
            <input className="filterInput"
            name="waiting"
            type="checkbox"
            checked={this.props.waiting}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Approved
            <input className="filterInput"
            name="approved"
            type="checkbox"
            checked={this.props.approved}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Rejected
            <input className="filterInput"
            name="rejected"
            type="checkbox"
            checked={this.props.rejected}
            onChange={this.props.handleInputChange}
            />
            
            </label>
            <label className="filterContainer">Kicked
            <input className="filterInput"
            name="kicked"
            type="checkbox"
            checked={this.props.kicked}
            onChange={this.props.handleInputChange}
            />
            
            </label>
          </div>
      </div>
    </form>
    );
  }
}
