import React from 'react'
import { Link } from 'react-router-dom'

export class Feedback extends React.Component {
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
        var feedback = this.props.feedback;
        var eventTime = new Date(feedback.event_start_time + "Z");
        var feedbackTime = new Date(feedback.feedback_time + "Z");
        var nowTime = new Date();

        var color =
            4 < feedback.rating && feedback.rating <= 5 ? "#27ae60" :
            3 < feedback.rating && feedback.rating <= 4 ? "#2980b9" :
            2 < feedback.rating && feedback.rating <= 3 ? "#f39c12" :
            /* 1 < feedback.rating <= 2 */ "#e74c3c"

        return(
            <div style={{
                border: "1px solid " + color,
                margin: "0",
                padding: "2vmin",
                width: "100%",
                backgroundColor: this.state.hover ? "#f8f8f8" : "transparent",
                transition: "0.1s",
            }} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff} >
                <img className="rounded img-fluid"
                    src={feedback.sender_image_url}
                    alt=""
                    style={{
                        maxHeight: "auto",
                        maxWidth: "5vw",
                        float: "left",
                }} />
                <h6 style={{ 
                    margin: "0",
                    marginLeft: "6vw"
                }}>
                    { feedback.sender_first_name}&nbsp;{ feedback.sender_last_name }
                    <span style={{
                            fontSize: "0.9em",
                            fontStyle: "italic",
                            fontWeight: "lighter",
                    }}>
                        &nbsp;&nbsp;@{ feedback.sender_nickname }

                        <span style={{
                            float: "right"
                        }}>
                            Played <Link to={"/event/" + feedback.event_id}>#{ feedback.sport_type }</Link> together on&nbsp; 
                            { ("0" + eventTime.getDate()).slice(-2) }
                            .{ ("0" + eventTime.getMonth()).slice(-2) }
                            .{ eventTime.getFullYear() }
                        </span>
                    </span>
                </h6>

                <p style={{ 
                    margin: "0", 
                    marginLeft: "6vw",
                    fontSize: "0.9em",
                }}>
                    <i style={{
                        fontSize: "1.0em",
                    }}>
                        { new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()) < feedbackTime ? "Today" : 
                            new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - 1) < feedbackTime ? "Yesterday" : (
                                <span>
                                    { ("0" + feedbackTime.getDate()).slice(-2) }
                                    .{ ("0" + feedbackTime.getMonth()).slice(-2) }
                                    .{ feedbackTime.getFullYear() }
                                </span>
                        )}
                            
                        &nbsp;
                        { ("0" + feedbackTime.getHours()).slice(-2) }
                        :{ ("0" + feedbackTime.getMinutes()).slice(-2) }
                    </i>

                    &nbsp;&nbsp;
                    <span className={
                        4 < feedback.rating && feedback.rating <= 5 ? "badge badge-success" :
                        3 < feedback.rating && feedback.rating <= 4 ? "badge badge-primary" :
                        2 < feedback.rating && feedback.rating <= 3 ? "badge badge-warning" :
                        /* 1 < feedback.rating <= 2 */ "badge badge-danger"
                    }>
                        { feedback.rating }
                    </span>
                </p>
                
                <hr style={{
                    marginLeft: "6vw"
                }}/>

                <p style={{ 
                    margin: "0", 
                    marginLeft: "6vw" 
                    }}>
                    { feedback.text }
                </p>
            </div>
        )
    }
}

export default Feedback;