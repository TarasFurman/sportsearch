import React from 'react';

import './index.css';
import defaultImage from './create.svg';

class LoadImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: defaultImage,
    };
  }

  handleChange(event) {
    if (event.target.files[0]) {
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
      });
    }
  }

  render() {
    const { file } = this.state;
    return (
      <div className="my-2 mb-3">
        <div className="col">
          <div className="image-block">
            <img className="rounded-circle mb-2" alt="event" src={file} />
            <input
              id="image"
              type="file"
              className="form-control-file mt-1"
              accept="image/png, image/jpeg"
              onChange={event => this.handleChange(event)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LoadImage;
