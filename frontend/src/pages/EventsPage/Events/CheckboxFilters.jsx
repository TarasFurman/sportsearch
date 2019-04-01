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
            <input className="filterInput"
            name="football"
            label="football1"
            type="checkbox"
            checked={this.props.football}
            onChange={this.props.handleInputChange}
            />Football
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="basketball"
            type="checkbox"
            checked={this.props.basketball}
            onChange={this.props.handleInputChange}
            />Basketball
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="volleyball"
            type="checkbox"
            checked={this.props.volleyball}
            onChange={this.props.handleInputChange}
            />Volleyball
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="chess"
            type="checkbox"
            checked={this.props.chess}
            onChange={this.props.handleInputChange}
            />Chess
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="ping_pong"
            type="checkbox"
            checked={this.props.ping_pong}
            onChange={this.props.handleInputChange}
            />Ping pong
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="other"
            type="checkbox"
            checked={this.props.other}
            onChange={this.props.handleInputChange}
            />Other
            </label>
          </div>
        </div>
        <div className="sportType sport2">
          <h4>Is owner</h4>
          <div className={'sportTypeFilters'}>
            <label className="filterContainer">
            <input className="filterInput"
            name="owner"
            type="checkbox"
            checked={this.props.owner}
            onChange={this.props.handleInputChange}
            />Owner
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="not_owner"
            type="checkbox"
            checked={this.props.not_owner}
            onChange={this.props.handleInputChange}
            />Not owner
            </label>
          </div>
        </div>
        <div className="sportType sport3">
          <h4>User status</h4>
          <div className={'sportTypeFilters'}>
            <label className="filterContainer">
            <input className="filterInput"
            name="waiting"
            type="checkbox"
            checked={this.props.waiting}
            onChange={this.props.handleInputChange}
            />Waiting for approving
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="approved"
            type="checkbox"
            checked={this.props.approved}
            onChange={this.props.handleInputChange}
            />Approved
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="rejected"
            type="checkbox"
            checked={this.props.rejected}
            onChange={this.props.handleInputChange}
            />Rejected
            </label>
            <label className="filterContainer">
            <input className="filterInput"
            name="kicked"
            type="checkbox"
            checked={this.props.kicked}
            onChange={this.props.handleInputChange}
            />Kicked
            </label>
          </div>
      </div>
    </form>
    );
  }
}
