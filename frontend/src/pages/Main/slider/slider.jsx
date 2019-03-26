import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import { withStyles } from '@material-ui/core/styles'
import { SliderRail, Handle, Track, Tick } from './components' 
import './slider.css'

const style = () => ({
  root: {
    height: 20,
    width: 260,
  },
  slider: {
    position: 'relative',
    width: '100%',
  },
})

const defaultValues = [0, 90]

class Example extends Component {
  state = {
    values: defaultValues.slice(),
    update: defaultValues.slice(),
  }

  onUpdate = update => {
    this.setState({ update })
    this.props.sliderDidUpdate(update)
  }

  onChange = values => {
    this.setState({ values })
  }

  componentDidMount ()
  {
    this.setState({
      values: this.props.defaultValues.slice(),
      update: this.props.defaultValues.slice(),
    })
  }

  render() {
    const {
      props: { classes, domain },
      state: { values},
    } = this

    return (
      <div className="slider">
      <div className={classes.root}>
        <Slider
          mode={3}
          step={1}
          domain={domain}
          className={classes.slider}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ activeHandleID, handles, getHandleProps }) => (
              <div>
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    activeHandleID={activeHandleID}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={10}>
            {({ ticks }) => (
              <div>
                {ticks.map(tick => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
      </div>
    )
  }
}

Example.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Example)
