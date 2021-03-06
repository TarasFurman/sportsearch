import React from 'react'

export class RequestEventMember extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false,
        }

        this.hoverOn = this.hoverOn.bind(this);
        this.hoverOff = this.hoverOff.bind(this);
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

    render() {
        var member = this.props.requestMember;
        var acceptButton = 
            <button type="button" className="btn btn-outline-success" style={{
                marginTop: "1vh",
                marginBottom: "1vh",
                marginRight: "2vw",
            }} onClick={ () => this.props.grantMember(member.id, 2) }>
                Accept
            </button>
        var rejectButton = 
            <button type="button" className="btn btn-outline-warning" style={{
                marginTop: "1vh",
                marginBottom: "1vh",
                marginRight: "2vw",
            }} onClick={ () => this.props.grantMember(member.id, 3) }>
                Reject
            </button>

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
                    </h6>

                    Member age: <b>{ member.age }</b>
                    
                    <div>
                        { this.props.eventStatus === 1 ? 
                            member.age >= this.props.eventMinAge && member.age <= this.props.eventMaxAge ? 
                                <>{ acceptButton } { rejectButton }</> : rejectButton : ""}
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default RequestEventMember;