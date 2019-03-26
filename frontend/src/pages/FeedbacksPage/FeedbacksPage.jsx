import React from 'react'
import { Link } from 'react-router-dom'

import BriefUserInfo from '../FeedbacksPage/FeedbackPage/BriefUserInfo'
import Feedbacks from '../FeedbacksPage/FeedbackPage/Feedbacks'

export class FeedbacksPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            userInfo: {},
            error: {},
        }
    }

    componentDidMount() {
        fetch(
            'http://localhost:5999/feedbacks/' + this.props.match.params.userId + "/info",
            {
                mode: "cors",
                credentials: "include",
            }
        )
        .then(response => response.json())
        .then(data => this.setState({
            isLoaded: true,
            userInfo: data.user_data,
            errorData: data.error,
        }))
        .catch(() => {});
    }

    wrongunauthorizedUserError() {
        return(
            <div>
                <h1 className="text-center">
                    You are not registered so you can not see this page.
                    <br/>
                    <Link to="/signup"> Register </Link>
                    or
                    <Link to="/signin"> Sign in </Link>
                </h1>
            </div>
        );
    }

    anotherError() {
        return(
            <div>
                <h1 className="text-center">
                    Some error was occurred, try to reload this page.
                    <br/>
                    Status code: { this.state.errorData.status }
                </h1>
            </div>
        );
    }

    render() {
        if (this.state.isLoaded) {
            if (this.state.errorData) {
                if (this.state.errorData.message === "UNAUTHORIZED_USER")
                {
                    return this.wrongunauthorizedUserError();
                }
                return this.anotherError();
            }
            else {
                return (
                    <div className="container" style={{
                        marginBottom: "5vh"
                    }}>
                        <BriefUserInfo userInfo={this.state.userInfo}/>
                        <hr/>
                        <h4 className="text-center">Feedbacks</h4>
                        <hr/>
                        <Feedbacks userId={this.props.match.params.userId} />
                    </div>
                )
            }
        }
        else {
            return (
                <div>
                    <div className="spinner-grow text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
    }
}

export default FeedbacksPage;