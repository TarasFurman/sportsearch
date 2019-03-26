import React from 'react'

export class BriefUserInfo extends React.Component {
    
    render() {
        var info = this.props.userInfo;

        var color =
            4 < info.rating && info.rating <= 5 ? "#27ae60" :
            3 < info.rating && info.rating <= 4 ? "#2980b9" :
            2 < info.rating && info.rating <= 3 ? "#f39c12" :
            /* 1 < info.rating <= 2 */ "#e74c3c"

        return (
            <div className="row" style={{
                border: "1px solid " + color,
                margin: "1vmin",
                padding: "2vmin",
            }}>
                <div className="col-xl-10">
                    <h3>{ info.first_name } { info.last_name }</h3>
                    <h6>
                        <i style={{
                            fontSize: "1.0em",
                        }}>
                            @{ info.nick }
                        </i>
                        &nbsp;&nbsp;
                        <span className={
                            4 < info.rating && info.rating <= 5 ? "badge badge-success" :
                            3 < info.rating && info.rating <= 4 ? "badge badge-primary" :
                            2 < info.rating && info.rating <= 3 ? "badge badge-warning" :
                            /* 1 < info.rating <= 2 */ "badge badge-danger"
                        }>
                            { info.rating }
                        </span>
                    </h6>
                </div>
                <div className="col-xl-2">
                    <a href={info.image_url}>
                        <img className="rounded img-fluid"
                            src={info.image_url}
                            alt=""
                            style={{
                                maxHeight: "20vh",
                                maxWidth: "auto",
                        }} />
                    </a>
                </div>
            </div>
        )
    }
}

export default BriefUserInfo;