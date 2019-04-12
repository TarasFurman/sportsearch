import React,{Component} from 'react';
import {Button} from "react-bootstrap";
import "../profileStyles/css/style.css";


class UploadProfilePhoto extends Component {
  constructor(props){
    super(props);
    this.state = {
      showPopup: false,
      file:'',
      imageURL:'',
      changed: false,
      badRequest:false,
    };
    this.closePopup = this.closePopup.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange() {
    this.props.imgChanger(this.state.imageURL);
  }
  closePopup() {
    this.props.popupClick();
  }
  onChangeHandler(e) {
    e.preventDefault();
    let file = e.target.files[0];
    this.setState({
      file: file,
      });
  }
  handleUploadImage(e) {
      e.preventDefault();
      const data = new FormData();
      const img =  this.state.file;
      data.append('img', img);
      fetch('http://localhost:5999/upload_profile_img', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: data,
      }).then((response) => response.json())
        .then((response) => {
          if (response['code'] === 200) {
            this.setState({
              imageURL: response.url,
              changed: true,
            })

          }
          else {
            this.setState({
            badRequest:true,
            })
          }
          this.handleChange();
        });
  }


  render() {
    return (
      <div className="popup">
        <div className='popup_inner'>
          {this.state.badRequest ?  'Error 400: Bad request' :''}
            <form onSubmit={this.handleUploadImage}>
              <div>
                <input type="file" name="file" onChange={this.onChangeHandler} />
              </div>
              <br />
              <div>
                <button>Upload</button>
              </div>
            </form>
            <p>{this.state.changed ? 'Photo updated' : ' '}</p>
          <Button onClick={this.closePopup}>Exit</Button>
        </div>
      </div>
    );
  }
}

export default UploadProfilePhoto;
