import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class IntervalExerciseWrapper extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.addValue = this.addValue.bind(this);
    this.removeValue = this.removeValue.bind(this);
    this.tuneValue = this.tuneValue.bind(this);
    this.holdTimer = undefined;
    this.timer = 500;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.repeat = this.repeat.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  handleChange(data, event) {
    this.props.onCompletion([data, this.props.index]);
    this.setState({
      value: data
    });
  }

  addValue() {
    var currentValue =
      this.state.value < parseFloat(this.props.treshold)
        ? this.state.value + 1
        : parseFloat(this.props.treshold);
    this.props.onCompletion([currentValue, this.props.index]);
    this.setState({
      value: currentValue
    });
  }

  removeValue() {
    var currentValue = this.state.value > 0 ? this.state.value - 1 : 0;
    this.props.onCompletion([currentValue, this.props.index]);
    this.setState({
      value: currentValue
    });
  }

  repeat(direction, event) {
    // Launch the tuner function
    this.tuneValue(direction, event);
    const _this = this;
    // Set a promise to deliver the same function until the timer is stopped
    let promise = setTimeout(() => {
      _this.repeat(direction, event);
      this.timer = 100;
    }, this.timer);
    this.holdTimer = promise;
  }

  onMouseDown(direction, event) {
    if (
      'ontouchstart' in document.documentElement &&
      event.type === 'mousedown'
    ) {
      return false;
    }
    // When button is down, prevent context menu
    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    // Launch the repeat function to then trigger the increase/decrease
    this.repeat(direction, event);
  }
  onMouseUp(event) {
    // When button is up, clear the timeout for the repeater
    clearTimeout(this.holdTimer);
    this.timer = 500;
    // And reinstate the context menu
    window.oncontextmenu = function(event) {
      return true;
    };
    this.setState({
      isPressed: false
    });
  }

  tuneValue(direction, index, event) {
    if (direction === 'more') {
      this.addValue();
      this.setState({
        isPressed: 'more'
      });
    } else {
      this.removeValue();
      this.setState({
        isPressed: 'less'
      });
    }
  }

  render() {
    return (
      <div
        className={`interval-exercice ${this.props.isCurrent ? 'active' : ''}`}>
        <div className="interval-heading">
          <p className="index">
            Exo. {this.props.index + 1}/{this.props.total}
          </p>
          <h2 className="name">{this.props.value.name}</h2>
        </div>
        <div className="interval-body">
          <div className="counter">
            <h3 className="counter-title">Set</h3>
            <p className="counter-value">
              {this.props.currentRound + 1}/{this.props.value.sets}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

IntervalExerciseWrapper.propTypes = {
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onCompletion: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  currentRound: PropTypes.number.isRequired
};

export default IntervalExerciseWrapper;
