import React, { Component } from "react";
import "./events.css";

export default class CheckboxFilters extends Component {
  
  render() {
    return (
      <form>
        <div className={'filters'}>
          <div className={'sportType'}>
            <h4>Sport type</h4>
            <div className={'sportTypeFilters'}>
              <label className={"container"}>Football
              <input
              name="football"
              label="football1"
              type="checkbox"
              checked={this.props.football}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Basketball
              <input
              name="basketball"
              type="checkbox"
              checked={this.props.basketball}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Volleyball
              <input
              name="volleyball"
              type="checkbox"
              checked={this.props.volleyball}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Chess
              <input
              name="chess"
              type="checkbox"
              checked={this.props.chess}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Ping pong
              <input
              name="ping_pong"
              type="checkbox"
              checked={this.props.ping_pong}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Other
              <input
              name="other"
              type="checkbox"
              checked={this.props.other}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
            </div>
          </div>
          <div className={'sportType'}>
            <h4>Is owner</h4>
            <div className={'sportTypeFilters'}>
              <label className={"container"}>Owner
              <input
              name="owner"
              type="checkbox"
              checked={this.props.owner}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Not owner
              <input
              name="not_owner"
              type="checkbox"
              checked={this.props.not_owner}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
            </div>
          </div>
          <div className={'sportType'}>
            <h4>User status</h4>
            <div className={'sportTypeFilters'}>
              <label className={"container"}>Waiting for approving
              <input
              name="waiting"
              type="checkbox"
              checked={this.props.waiting}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Approved
              <input
              name="approved"
              type="checkbox"
              checked={this.props.approved}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Rejected
              <input
              name="rejected"
              type="checkbox"
              checked={this.props.rejected}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
              <label className={"container"}>Kicked
              <input
              name="kicked"
              type="checkbox"
              checked={this.props.kicked}
              onChange={this.props.handleInputChange}
              />
              <span className={"checkmark"}></span>
              </label>
            </div>
          </div>
        </div>
    </form>
    );
  }
}
