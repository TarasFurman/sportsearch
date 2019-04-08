import React from 'react'
import { Link } from 'react-router-dom'
 
export class ActiveEventMember extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false,
            comment: "",
            mark: 1,
        }
        this.hoverOn = this.hoverOn.bind(this);
        this.hoverOff = this.hoverOff.bind(this);
        this.onChangeMark = this.onChangeMark.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
    }

    hoverOn() {
        this.setState({
            hover: true,
        });
    }

    hoverOff() {
        this.setState({
            hover: false,
        });
    }

    onChangeMark(e) {
        this.setState({
            mark: e.target.value,
        });
    }

    onChangeComment(e) {
        e.preventDefault();
        this.setState({
            comment: e.target.value,
        });
    }

    render() {
        var member = this.props.eventMember;
        var you = <span className="badge badge-success">You</span>;
        var admin = <span className="badge badge-warning">Admin</span>
        var kickButton = 
            <button type="button" className="btn btn-outline-danger" style={{
                marginTop: "1vh",
                marginBottom: "1vh",
                marginRight: "2vw",
            }} 
                onClick={() => { 
                    window.confirm("Are you sure? The user may be angry.") ? 
                            this.props.kick(member.id) : console.log("Good admin!") }}>
                Kick
            </button>
        var rate = 
            <div className="form-group">
                <label htmlFor="dropdownmarks">Rate this user:</label>
                <select className="form-control" id="dropdownmarks" onChange={ this.onChangeMark }>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <label htmlFor="review">Write a comment if you want:</label>
                <textarea className="form-control" id="review" onChange={ this.onChangeComment }></textarea>
                <br/>
                <button type="button" className="btn btn-outline-primary"
                    onClick={() => { this.props.rate(member.id, Number(this.state.mark), this.state.comment) }}>
                Rate
                </button>
            </div>
        var mark = 
                <span style={{
                    border: "1px solid #3498db",
                    padding: "1vmin",
                    display: "inline-block",
                }}>
                    Your mark for this user is <b>{ member.request_user_rating }</b>
                </span>

        return( 
            <div className="row" style={{
                borderTop: "1px solid #AE99AF",
                margin: "1vmin",
                marginBottom: "0",
                marginTop: "0",
                paddingTop: "1vh",
                paddingBottom: "1vh",
                backgroundColor: this.state.hover ? "#f8f8f8" : "transparent",
                transition: "0.1s",
            }} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-8 text-center">
                    <img className="rounded img-fluid"
                        src={ member.image_url } 
                        alt=""
                        style={{
                            maxHeight: "10vh",
                            maxWidth: "auto",
                    }}/>
                    <p className="badge badge-primary" style={{
                        width: "100%",
                        marginTop: "2vh",
                        marginBottom: "0",
                    }}>
                        { member.rating ? member.rating : 0 }/5
                    </p>

                </div>
                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-4">
                    <Link to={'/another-user-profile/'+ member.id }>
                    <h6>
                        { member.name }
                        &nbsp;
                        { member.surname }
                        &nbsp;&nbsp;
                        <span style={{
                            fontSize: "0.8em",
                            fontStyle: "italic",
                            fontWeight: "lighter",
                        }}>
                            @{ member.nickname }
                        </span>

                        &nbsp;
                        { this.props.isAdmin ? admin : ""}
                        &nbsp;
                        { this.props.isMember ? you : "" }
                    </h6>
                    </Link>
                    { this.props.userisAdmin ? !this.props.isAdmin ? kickButton : "" : ""}

                    { !this.props.isMember && this.props.eventStatus === 2 ? member.request_user_rating === 0 ? rate : mark : ""}

                </div>
            </div>
        );
    }
}

export default ActiveEventMember;