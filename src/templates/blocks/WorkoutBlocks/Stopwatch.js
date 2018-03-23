import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import 'moment/locale/fr';

class Stopwatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      running: false
    };
    this.timerWrapper = null;
  }

  toggleStopwatch() {
    if (this.state.running) {
      this.setState({
        running: false
      });
      clearTimeout(this.timerWrapper);
      this.props.getCurrentTime(this.state.currentTime);
    } else {
      this.setState({
        running: true
      });
      this.repeater();
    }
  }

  repeater() {
    this.setState({
      currentTime: this.state.currentTime + 1
    });
    const _this = this;
    // Set a promise to deliver the same function until the timer is stopped
    let promise = setTimeout(() => {
      _this.repeater();
    }, 1000);
    this.timerWrapper = promise;
  }

  componentWillReceiveProps(nextProps) {
    // Using a prop set on a short timer it's possible for the parent component
    // to signal the stopwatch that it needs to stop.
    // We check for nextprop redunduncy to avoid infinite looping.
    if (nextProps.stop === true && this.props.stop !== true) {
      this.setState({
        running: false
      });
      clearTimeout(this.timerWrapper);
      this.props.getCurrentTime(this.state.currentTime);
    }
  }

  componentWillUnmount() {
    this.setState({
      running: false
    });
    clearTimeout(this.timerWrapper);
  }

  render() {
    let timeFormat = this.state.currentTime < 3600 ? 'mm:ss' : 'kk:mm:ss';
    return (
      <button id="stopwatch" onClick={this.toggleStopwatch.bind(this)}>
        <div
          className={'stopwatch-btn ' + (this.state.running ? ' running' : '')}>
          <div className={this.state.running ? 'hidden' : 'visible'}>
            <FontAwesomeIcon icon={['fas', 'play']} size="1x" />
          </div>
          <div className={this.state.running ? 'visible' : 'hidden'}>
            <FontAwesomeIcon icon={['fas', 'pause']} size="1x" />
          </div>
        </div>
        <p>
          {moment()
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0)
            .second(this.state.currentTime)
            .format(timeFormat)}
        </p>
      </button>
    );
  }
}

Stopwatch.propTypes = {
  getCurrentTime: PropTypes.func.isRequired
};

export default Stopwatch;
