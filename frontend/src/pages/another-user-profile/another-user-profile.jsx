import React from 'react';
import { withSportSearchService } from '../hoc';
import '../../service/sport-search-service';
import Rating from 'react-rating';
import StarGrey from './rating-star/star-grey.png';
import StarYellow from './rating-star/star-yellow.png';
import FakeUser from './rating-star/fakeuser.png';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import '@mdi/font/css/materialdesignicons.css';

const styles = theme => ({
  root: {
    flexGrow: 20,
  },
  paper: {
    padding: theme.spacing.unit * 4,
    margin: 'auto',
    maxWidth: 1000,
  },
  image: {
    width: 256,
    height: 256,
  },
  img: {
      margin: 'center',
      display: 'block',
      maxWidth: '500%',
      maxHeight: '500%',
      width: '100%',
      height: '80%',
    }
});

class AnotherUserProfile extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            anotherUser: {},
            isLoaded: false,
        }
    }

    componentDidMount()
    {
        // var from rout
        let anotherUserId_in_url =  this.props.match.params.anotherUserId 

        // call webservice
        this.props.sportSearchService.getAnotherUser(anotherUserId_in_url)
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
      
    render() {
        const { classes } = this.props;
        return (

            <div>
            <div className={classes.root}>
            <Paper className={classes.paper}>
              <Grid container spacing={16}>
                <Grid item>
                <ButtonBase className={classes.image}>
                <Grid container spacing={16}>
                  <Grid item>
  
                    <img className={classes.img} alt="complex" src={this.state.anotherUser.user_image_url}/>
                    <Rating 
             initialRating={this.state.anotherUser.user_rating}
             readonly
             emptySymbol={<img src={StarGrey} className="icon" />}
             fullSymbol={<img src={StarYellow} className="icon" />}
              />
                    </Grid>
                    </Grid>
                </ButtonBase>
                    
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={16}>
                    <Grid item xs>
                      <Typography variant="h6">
                      <b>Nickname:</b><span>&nbsp;&nbsp;</span>
                      {this.state.anotherUser.user_nickname}
                      </Typography>
                      <Typography ><b>Name:</b><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_first_name}</Typography>
                      <Typography ><b>Surname:</b><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_last_name}</Typography>
                      <Typography ><b>Description:</b><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_description}</Typography>
                      <Typography ><i className="fas fa-birthday-cake fa-lg"></i><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_birth_date}</Typography>
                    </Grid>
                    <Grid item>
                    <Typography style={{ cursor: 'pointer' }}><i className="fas fa-at fa-lg"></i><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_email}</Typography>
                      <Typography style={{ cursor: 'pointer' }}><i className="fas fa-phone fa-lg"></i><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_phone}</Typography>
                      <Typography style={{ cursor: 'pointer' }}><i className="fab fa-viber fa-lg"></i><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_viber_account}</Typography>
                      <Typography style={{ cursor: 'pointer' }}><i className="fab fa-telegram fa-lg"></i><span>&nbsp;&nbsp;</span>{this.state.anotherUser.user_telegram_account}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </div>
            </div>
        )
    }
};

AnotherUserProfile.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withSportSearchService()(withStyles(styles)(AnotherUserProfile));
