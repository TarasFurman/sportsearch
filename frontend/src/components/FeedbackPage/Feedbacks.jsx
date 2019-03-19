import React from 'react'

import Feedback from './Feedback'

export class Feedbacks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            feedbacks: [],
            isLoaded: false,
            limit: 5,
            offset: 0,
        }

        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll(e) {
        e.preventDefault();
        // On some systems, scrollTop gives a Decimal value, so we need to check not for strict equality itself,
        // but for equality of an ceil or floor of that number (we can't predict what value it'll get (<> 0.5))
        var bottom = Math.floor(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight
            || Math.ceil(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight;
        if (bottom) { 
            this.getFeedbacks();
         }
    }

    getFeedbacks() {
        fetch(
            "http://localhost:5999/feedbacks/" + this.props.userId + "/data"
            + "?offset=" + this.state.offset 
            + "&limit=" + this.state.limit,
            {
                mode: "cors",
                credentials: "include",
            }
        )
        .then(response => response.json())
        .then(data => data.feedbacks)
        .then(data => {
            this.setState({
                feedbacks: [...this.state.feedbacks, ...data],
                offset: this.state.offset + data.length,
                isLoaded: true,
            })
        })
        .catch((error => console.log("error", error)));
    }

    componentDidMount() {
        this.getFeedbacks();
    }
    
    render() {
        if (this.state.isLoaded){
            return(
                <div style={{
                    border: "1px solid #8e44ad",
                }}>
                    <ul className="list-group" style={{
                        maxHeight: "70vh",
                        padding: "2vmin",
                        overflow: "auto",
                    }} onScroll={ this.handleScroll }>
                        { this.state.feedbacks.map(feedback => (
                            <li className="list-group-item border-0" key={ feedback.id }
                            style={{ 
                                margin: "0",
                                marginBottom: "3vh", 
                                padding: "0"
                            }}>
                                <Feedback 
                                    feedback={ feedback } />
                                <hr style={{ 
                                    maxWidth: "50%",
                                    color: "#1abc9c",
                                    margin: "0",
                                }}/>
                            </li>
                        )) }
                    </ul>
                </div>
            );
        }
        else {
            return(
                <div>
                    <div className="spinner-grow text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
    }
}

export default Feedbacks;