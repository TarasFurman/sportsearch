import React from 'react';
import PropTypes from 'prop-types';

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
      const { handleFileChange } = this.props;
      // change image on page view
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
      });
      handleFileChange(event.target.files[0]);
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
              accept="image/png, image/jpeg, image/jpg"
              onChange={event => this.handleChange(event)}
            />
          </div>
        </div>
      </div>
    );
  }
}

LoadImage.propTypes = {
  handleFileChange: PropTypes.func.isRequired,
};

export default LoadImage;
