import React from 'react'

export class EventInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fullDescr: false,
        };

        this.changeDescription = this.changeDescription.bind(this);
    }

    changeDescription(e) {
        e.preventDefault();
        this.setState({
            fullDescr: !this.state.fullDescr,
        });
    }

    render() {
        var info = this.props.eventInfo;
        var givendate1 = new Date(info.start_time);
        var givendate2 = new Date(info.end_time);
        var nowdate = new Date();

        //////////////////////////////////////////////////
        const showHide = 
            <a href="#" className="badge badge-light" onClick={e => this.changeDescription(e) }>
                { this.state.fullDescr ? "Show less" : "Show more" }
            </a>;

        //////////////////////////////////////////////////
        const buttonLeaveCancel = 
            <div style={{
                marginTop: "3vh",
            }}>
                <p style={{
                    color: "#d63031",
                    fontWeight: "bold",
                    margin: "0",
                    textAlign: "left",
                }}>
                    Danger zone!
                </p>

                <div style={{
                    border: '4px solid #ff7675'
                }}>
                    <button type="button" className="btn btn-outline-danger" style={{
                        marginTop: "2vh",
                        marginBottom: "2vh",
                    }} 
                        onClick={() => { 
                            window.confirm("Are you sure? This action can not be ondone.") ? 
                                this.props.isOwner ? 
                                    this.props.cancelEvent() : this.props.leaveEvent()
                                    : console.log("Good choice!") }}>
                        { this.props.isOwner ? "Cancel event" : "Leave event" }
                    </button>
                </div>
            </div>

        //////////////////////////////////////////////////
        const buttonPay = 
            <button type="button" className="btn btn-outline-success" style={{
                marginTop: "2vh",
                marginBottom: "2vh",
                width: "100%",
            }}>
                Pay
            </button>
        

        return(
            <>
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 text-center" style={{
                        borderRight: "1px solid #d3d3d3",
                    }}>
                        <a href={ info.image_url }>
                            <img className="rounded img-fluid"
                                src={ info.image_url } 
                                alt=""
                                style={{
                                    maxHeight: "20vh",
                                    maxWidth: "auto",
                                    // width: "100%",
                                    // height: "auto",
                            }}/>
                        </a>

                        { info.price ? buttonPay : ""}
                        
                        
                        { info.status_id === 1 ? buttonLeaveCancel : "" }
                        
                    </div>

                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12" style={{
                        // marginLeft: "22vw",
                        textAlign: "justify",
                    }}>
                        <h2>
                            { info.name } 
                        </h2>

                        <hr/>

                        <h5>
                            Start time:
                            &nbsp;
                            { new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate()) < givendate1 ? "Today" : 
                                new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate() - 1) < givendate1 ? "Yesterday" : (
                                    <span>
                                        { ("0" + givendate1.getDate()).slice(-2) }
                                        .{ ("0" + givendate1.getMonth()).slice(-2) }
                                        .{ givendate1.getFullYear() }
                                    </span>
                            )}
                            &nbsp;&nbsp;
                            { ("0" + new Date(info.start_time).getHours()).slice(-2) }:
                            { ("0" + new Date(info.start_time).getMinutes()).slice(-2) }
                        </h5>
                        <h5>
                            End time:
                            &nbsp;
                            { new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate()) < givendate2 ? "Today" : 
                                new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate() - 1) < givendate2 ? "Yesterday" : (
                                    <span>
                                        { ("0" + givendate2.getDate()).slice(-2) }
                                        .{ ("0" + givendate2.getMonth()).slice(-2) }
                                        .{ givendate2.getFullYear() }
                                    </span>
                            )}
                            &nbsp;&nbsp;
                            { ("0" + new Date(info.end_time).getHours()).slice(-2) }:
                            { ("0" + new Date(info.end_time).getMinutes()).slice(-2) }
                        </h5>
                        <h5>
                            Period: { info.period ? info.period + " days" : "one-time event" }
                        </h5>
                        <h5>
                            Price: ${ info.price ? info.price : 0 }
                        </h5>
                        <h5>
                            Age: { info.age_from } to { info.age_to }
                        </h5>
                        <h5>
                            Description:
                        </h5>
                        <span>
                            { info.description ? 
                                this.state.fullDescr ? 
                                    info.description : info.description.slice(0, 50) : "No description provided." }
                            { this.state.fullDescr ? "" : "..."}
                            &nbsp;&nbsp;
                            { info.description && info.description.length > 50 ? 
                                showHide : "" }
                        </span>
                    </div>
                </div>
            </>
        );
    }
}

export default EventInfo;