import React from 'react'

export class EventMessage extends React.Component {
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
        var givendate = new Date(this.props.message.message_time + "Z");
        var nowdate = new Date();
        var you = <span className="badge badge-success">You</span>;
        var admin = <span className="badge badge-warning">Admin</span>

        return(
            <div style={{
                margin: "0",
                padding: "2vmin",
                width: "100%",
                backgroundColor: this.state.hover ? "#f8f8f8" : "transparent",
                transition: "0.1s",
            }} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>

                <img src={ this.props.message.sender_image_url } alt="" style={{
                    maxHeight: "auto",
                    maxWidth: "2vw",
                    float: "left",
                }}/>

                <h6 style={{ 
                    margin: "0",
                    marginLeft: "3vw"
                }}>
                    @{ this.props.message.sender_nickname }

                    &nbsp;
                    { this.props.thisAdminMessage ? admin : ""}
                    &nbsp;
                    { this.props.thisMemberMessage ? you : "" }

                    &nbsp;&nbsp;&nbsp;&nbsp;

                    <span style={{
                        fontSize: "0.8em",
                        fontStyle: "italic",
                        fontWeight: "lighter",
                    }}>
                        { new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate()) < givendate ? "Today" : 
                            new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate() - 1) < givendate ? "Yesterday" : (
                                <span>
                                    { ("0" + givendate.getDate()).slice(-2) }
                                    .{ ("0" + givendate.getMonth()).slice(-2) }
                                    .{ givendate.getFullYear() }
                                </span>
                        )}
                        
                        &nbsp;&nbsp;
                        { ("0" + givendate.getHours()).slice(-2) }
                        :{ ("0" + givendate.getMinutes()).slice(-2) }
                    </span>
                </h6>

                <p style={{ 
                    margin: "0", 
                    marginLeft: "3vw" 
                    }}>
                    { this.props.message.text }
                </p>

            </div>
        );
    }
}

export default EventMessage;