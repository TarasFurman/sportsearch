import React, {Component} from 'react';
import SliderComponent from '../slider';
import DatePickers from '../datetime';
import './filters-form.css';
import { withSportSearchService } from '../../hoc';
import {connect} from 'react-redux';
import {fetchEvents} from '../../../redux/actions';
import '@mdi/font/css/materialdesignicons.css';
import Grid from '@material-ui/core/Grid';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { withStyles } from '@material-ui/core/styles';

const SportIDsEnum = {
    Football: 1,
    Volleyball: 2,
    Chess: 3,
    Basketball: 4,
    PingPong: 5,
    Other: 6
};

const styles = theme => ({
    title: {
      color: 'rgb(255, 255, 255)',
    }
  })

const CheckboxComponent = ({name, onClickFunction, iconClassName}) =>
{
    return (
        <div className="filter-checkbox pretty p-icon p-curve p-rotate p-bigger">
            <input type="checkbox" onClick={onClickFunction} />
            <div className="state">
            <i className={iconClassName}></i>
                <label className="control-title">{name}</label>
            </div>
        </div>
    );
};

class FiltersForm extends Component {

    filtersDictionary = { "sport_ids" : [],
                          "x1_coord" : 30.809814,
                          "y1_coord" : 50.871979,
                          "x2_coord" : 30.206404,
                          "y2_coord" : 50.272314,
                          "start_time" : 1509021428,
                          "end_time" : 1601354297
                        }

    render(){

        const { classes } = this.props;

        return (
            <div className="filters-form">
                <Grid container justify="center" id="sport-types-grid">
                        <CheckboxComponent name={"Free"} iconClassName={"icon mdi mdi-currency-usd-off"} onClickFunction= { () => this.freeFilterClicked() }/>
                        <CheckboxComponent name={"Paid"} iconClassName={"icon mdi mdi-currency-usd"} onClickFunction={() => this.paidFilterClicked()} />
                        <CheckboxComponent name={"Football"} iconClassName={"icon mdi mdi-soccer"} onClickFunction={() => this.footballFilterClicked()} />
                        <CheckboxComponent name={"Volleyball"} iconClassName={"icon mdi mdi-volleyball"} onClickFunction={() => this.volleyballFilterClicked()} />
                        <CheckboxComponent name={"Chess"} iconClassName={"icon mdi mdi-chess-knight"} onClickFunction={() => this.chessFilterClicked()}/>
                        <CheckboxComponent name={"Basketball"} iconClassName={"icon mdi mdi-basketball"}  onClickFunction={() => this.basketballFilterClicked()} />
                        <CheckboxComponent name={"Ping Pong"} iconClassName={"icon mdi mdi-tennis"} onClickFunction={() => this.pingpongFilterClicked()}/>
                        <CheckboxComponent name={"Other"} iconClassName={"icon mdi mdi-run-fast"} onClickFunction={() => this.otherFilterClicked()} />
                </Grid>
                <Grid id="sliders-and-date-form-grid" container justify="center" alignItems='center'>
                    <FormControl component='fieldset' variant='outlined'>
                        <FormLabel className={classes.title} component='legend'>{"Date from:"}</FormLabel>
                        <DatePickers  onChange={this.dateFromDidChange}/>
                    </FormControl>
                    <FormControl component='fieldset' variant='outlined'>
                        <FormLabel className={classes.title} component="legend">{"Date to:"}</FormLabel>
                        <DatePickers onChange={this.dateToDidChange}/>
                    </FormControl>
                    <FormControl component='fieldset' variant='outlined'>
                        <FormLabel className={classes.title} component='legend'>{"Age of players:"}</FormLabel>
                            <SliderComponent sliderDidUpdate={this.sliderAgeDidUpdate} domain ={[10, 90]} defaultValues = {[10,90]} />
                    </FormControl>
                    <FormControl component='fieldset' variant='outlined'>
                        <FormLabel className={classes.title} component='legend'>{"Members quantity:"}</FormLabel>
                            <SliderComponent sliderDidUpdate={this.sliderMembersDidUpdate} domain ={[2, 20]} defaultValues = {[2,20]} />
                    </FormControl>
                </Grid>
            </div>
        );
    };

    componentDidMount = () =>
    {
        this.updateFiltersOnService();
    }

    updateFiltersOnService = () =>
    {
        this.props.sportSearchService.filtersDictionary= this.filtersDictionary;
        this.props.updateFilters();
    }

    freeFilterClicked = () =>
    {

        if (this.filtersDictionary["price_paid"] === true && this.filtersDictionary["price_free"] !== true) {
            delete this.filtersDictionary.price_paid
            delete this.filtersDictionary.price_free
            this.updateFiltersOnService();
            this.filtersDictionary["price_free"] = true
            this.filtersDictionary["price_paid"] = true

        }
        else if (this.filtersDictionary.hasOwnProperty('price_free')) {
            delete this.filtersDictionary.price_free
            this.updateFiltersOnService();
        }
        else {
            this.filtersDictionary["price_free"] = true;
            this.updateFiltersOnService();
        }
     };

    paidFilterClicked = () =>
    {

        if (this.filtersDictionary["price_free"] === true && this.filtersDictionary["price_paid"] !== true) {
            delete this.filtersDictionary.price_paid
            delete this.filtersDictionary.price_free
            this.updateFiltersOnService();
            this.filtersDictionary["price_free"] = true
            this.filtersDictionary["price_paid"] = true
        }
        else if (this.filtersDictionary.hasOwnProperty('price_paid')) {
            delete this.filtersDictionary.price_paid
            this.updateFiltersOnService();
        }
        else {
            this.filtersDictionary["price_paid"] = true;
            this.updateFiltersOnService();
        }
    };

    chessFilterClicked = () =>
    {
        this.updateFiltersFormBySpportID(SportIDsEnum.Chess);
    };

    footballFilterClicked = () =>
    {
        this.updateFiltersFormBySpportID(SportIDsEnum.Football);
    };

    basketballFilterClicked = () =>
    {
        this.updateFiltersFormBySpportID(SportIDsEnum.Basketball);
    };

    pingpongFilterClicked = () =>
    {
        this.updateFiltersFormBySpportID(SportIDsEnum.PingPong);
    };

    volleyballFilterClicked = () =>
    {
        this.updateFiltersFormBySpportID(SportIDsEnum.Volleyball);
    };

    otherFilterClicked = () =>
    {
        this.updateFiltersFormBySpportID(SportIDsEnum.Other);
    };


    sliderAgeDidUpdate = (values) =>
    {
        this.filtersDictionary.age_from = values[0];
        this.filtersDictionary.age_to = values[1];
        this.updateFiltersOnService();
    };

    sliderMembersDidUpdate = (values) =>
    {
        this.filtersDictionary.members_from = values[0];
        this.filtersDictionary.members_to = values[1];
        this.updateFiltersOnService();
    };

    dateFromDidChange = (date) =>
    {

        this.filtersDictionary.start_time = date;
        this.updateFiltersOnService();
    }

    dateToDidChange = (date) =>
    {
        this.filtersDictionary.end_time = date;
        this.updateFiltersOnService();
    }

    updateFiltersFormBySpportID = (sportID) =>
    {
        let filters_array = this.filtersDictionary["sport_ids"];

        let indexOfChessSportType = filters_array.indexOf(sportID);
        if (indexOfChessSportType > -1)
        {
            filters_array.splice(indexOfChessSportType, 1);
        }
        else
        {
            filters_array.push(sportID);
        }

        this.updateFiltersOnService();
    }
};

const mapDispatchToProps = (dispatch, ownProps) =>
{
    return {
        updateFilters : fetchEvents(ownProps.sportSearchService, dispatch)
    };
};

export default  withStyles(styles)( 
                withSportSearchService()(
                connect(null, mapDispatchToProps) (FiltersForm)));
