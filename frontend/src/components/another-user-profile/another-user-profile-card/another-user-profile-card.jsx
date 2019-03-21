import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea'
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneTwoTone';
import MailOutlinedIcon from '@material-ui/icons/MailTwoTone';
import AboutOutlinedIcon from '@material-ui/icons/FaceTwoTone';
import RateOutlinedIcon from '@material-ui/icons/GradeTwoTone';
import { withRouter } from 'react-router-dom';


import MailIcon from '@material-ui/icons/Mail';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { withSportSearchService } from '../../hoc';
import imageUrl from './assets/background.jpg';

const styles = theme => ({
    typography: {
        cursor: 'pointer'
    },
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '20%', 
    },
    actions: {
        display: 'flex',
    },
    avatar: {
        width: 80,
        height: 80,
        textAlign: 'center',
    },
    moreInfo: {
        marginLeft: 'auto',
    }
});

class AnotherUserProfileCard extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            anotherUser: {},
            isLoaded: false,
            anchorEl: null
        }
    }

    componentDidMount()
    {
        // call webservice
        this.props.sportSearchService.getAnotherUser(this.props.userId)
        .then(
            (data) =>
            {
                if (data.users_profile != undefined)
                {
                    this.setState({
                        anotherUser: data.users_profile,
                        isLoaded: true
                    })
                }
            }
        );
    }

    handleClick = event => {
        this.setState({
        anchorEl: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
        anchorEl: null,
        });
    };

    handleMailClick = () => {
        if (this.state.anotherUser.user_email != undefined)
        {
            window.location.assign("mailto:"+this.state.anotherUser.user_email +"?subject=Hello&body=Hello, "+this.state.anotherUser.user_nickname+"!");
        }
    };

    handleAnotherUserMoreInfoClick = () => {
        this.handleClose();

        let path = '/another-user-profile/'+ String(this.props.userId);
        this.props.history.push(path);
    }


  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
            <Typography inline
                className={classes.typography}
                aria-owns={open ? 'simple-popper' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
                variant='inherit'
            >
                {this.props.children}
            </Typography>
            <Popover
                id="simple-popper"
                open={open}
                anchorEl={anchorEl}
                onClose={this.handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Card className={classes.card}>
                    <CardHeader
                    avatar={
                        <Avatar aria-label="Player" className={classes.avatar} src={this.state.anotherUser.user_image_url} >
                            {this.state.anotherUser.user_nickname}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="Close"                     
                        onMouseDown={this.handleClose}>
                        <CloseIcon color='error' />
                        </IconButton>
                    }
                    title={this.state.anotherUser.user_nickname}
                    subheader={this.state.anotherUser.user_birth_date}
                    />
                    <CardActionArea  onMouseUp={this.handleAnotherUserMoreInfoClick}>
                        <CardMedia className={classes.media} image={imageUrl} title="Profile"/>
                        <CardContent>
                            <Typography variant="subtitle2"  gutterBottom>
                                <RateOutlinedIcon />
                                {"   Rating:  "}
                                <Typography inline variant="subtitle1" gutterBottom>
                                    {this.state.anotherUser.user_rating}
                                </Typography>
                            </Typography>
                            <Typography variant="subtitle2"  gutterBottom>
                                <PhoneOutlinedIcon />
                                {"   Phone:  "}
                                <Typography inline variant="subtitle1" gutterBottom>
                                    {this.state.anotherUser.user_phone}
                                </Typography>
                            </Typography>
                            <Typography variant="subtitle2"  gutterBottom>
                                <MailOutlinedIcon />
                                {"   Mail: "}
                                <Typography inline variant="subtitle1" gutterBottom>
                                    {this.state.anotherUser.user_email}
                                </Typography>
                            </Typography>
                            <Typography variant="subtitle2"  gutterBottom>
                                <AboutOutlinedIcon />
                                {"   About:"}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {this.state.anotherUser.user_description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions className={classes.actions} >
                        <IconButton
                            onClick={this.handleMailClick}
                            aria-label="Mail">
                            <MailIcon color='error' />
                        </IconButton>
                        <IconButton 
                            className={classes.moreInfo}
                            onMouseUp={this.handleAnotherUserMoreInfoClick}
                            aria-label="More info">
                            <MoreHorizIcon color='error'/>
                        </IconButton>
                    </CardActions>
                </Card>
            </Popover>
      </div>
    );
  }
}

AnotherUserProfileCard.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withRouter(
               withSportSearchService()(
               withStyles(styles)(AnotherUserProfileCard)));
