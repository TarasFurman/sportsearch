import React from 'react'

export class EventMessageForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.text);
        this.setState({
            text: "",
        });
    }

    onChange(e) {
        this.setState({
            text: e.target.value,
        });
    }

    render() {
        return(
            <div>
                <form onSubmit={ this.onSubmit } className="form-group">
                    <div className="input-group">
                        <input type="text"
                            placeholder="Enter your text here..."
                            value={ this.state.text }
                            onChange={ this.onChange }
                            className="form-control" />
                        <div className="input-group-append">
                            <input className="btn btn-outline-success" type="submit" value="Send" />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default EventMessageForm;