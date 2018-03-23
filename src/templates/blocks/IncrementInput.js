import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class IncrementInput extends Component {
  constructor(props) {
    super(props);
    this.tuneValue = this.tuneValue.bind(this);
    this.holdTimer = undefined;
    this.timer = 500;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.repeat = this.repeat.bind(this);
    this.state = {
      isPressed: false
    };
  }

  repeat(direction, index, event) {
    // Launch the tuner function
    this.tuneValue(direction, index, event);
    const _this = this;
    // Set a promise to deliver the same function until the timer is stopped
    let promise = setTimeout(() => {
      _this.repeat(direction, index, event);
      this.timer = 100;
    }, this.timer);
    this.holdTimer = promise;
  }

  onMouseDown(direction, index, event) {
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
    this.repeat(direction, index, event);
    this.setState({
      isPressed: this.props.name,
      direction: direction
    });
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
      isPressed: false,
      direction: false
    });
  }

  tuneValue(direction, index, event) {
    let newValue, eventObject, value;

    switch (this.props.name) {
      case 'reps':
        value = this.props.currentExercise.reps;
        break;

      case 'sets':
        value = this.props.currentExercise.sets;
        break;

      case 'handicap':
        value = this.props.currentExercise.handicap
          ? this.props.currentExercise.handicap
          : 0;
        break;

      default:
        value = null;
    }

    if (direction === 'more') {
      newValue = parseFloat(value) + 1;
      eventObject = {
        target: {
          name: this.props.name,
          value: newValue
        }
      };
    } else {
      newValue = parseFloat(value) > 0 ? parseFloat(value) - 1 : 0;
      eventObject = {
        target: {
          name: this.props.name,
          value: newValue
        }
      };
    }
    this.props.updater(this.props.index, eventObject);
  }

  render() {
    return (
      <div
        className={
          this.state.isPressed && this.state.isPressed === this.props.name
            ? 'col pressed ' + this.state.direction
            : 'col'
        }>
        <button
          className="button"
          type="button"
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseDown={this.onMouseDown.bind(this, 'less', this.props.index)}
          onTouchEnd={this.onMouseUp.bind(this)}
          onTouchCancel={this.onMouseUp.bind(this)}
          onTouchStart={this.onMouseDown.bind(this, 'less', this.props.index)}>
          <FontAwesomeIcon icon={['fas', 'minus']} size="1x" />
        </button>
        <div className="input">
          <p>{this.props.unit}</p>
          <input
            type="number"
            value={this.props.value}
            onChange={this.props.updater.bind(this, this.props.index)}
          />
        </div>
        <button
          className="button"
          type="button"
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseDown={this.onMouseDown.bind(this, 'more', this.props.index)}
          onTouchEnd={this.onMouseUp.bind(this)}
          onTouchCancel={this.onMouseUp.bind(this)}
          onTouchStart={this.onMouseDown.bind(this, 'more', this.props.index)}>
          <FontAwesomeIcon icon={['fas', 'plus']} size="1x" />
        </button>
      </div>
    );
  }
}

IncrementInput.propTypes = {
  value: PropTypes.number.isRequired,
  updater: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  currentExercise: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
};

export default IncrementInput;
