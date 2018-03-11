import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class SetCounter extends Component {
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
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

  onMouseDown(direction, index, event) {
    // When button is down, prevent context menu
    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    // Launch the repeat function to then trigger the increase/decrease
    this.repeat(direction, index, event);
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
    let newValue, eventObject, value;

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
        className={
          this.state.value === parseFloat(this.props.treshold)
            ? 'set-counter completed'
            : 'set-counter'
        }
        key={'set-' + this.props.index}>
        <div className="set-heading">
          <p className="count">
            <span>
              {this.props.value}/{this.props.treshold}
            </span>
            {this.props.repUnit}
          </p>
        </div>
        <div
          className={
            this.state.isPressed
              ? 'set-body pressed ' + this.state.isPressed
              : 'set-body'
          }>
          <button
            className="value-button"
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseDown={this.onMouseDown.bind(this, 'less')}
            onTouchEnd={this.onMouseUp.bind(this)}
            onTouchCancel={this.onMouseUp.bind(this)}
            onTouchStart={this.onMouseDown.bind(this, 'less')}>
            <FontAwesomeIcon icon={['fas', 'minus']} size="1x" />
          </button>
          <Slider
            min={0}
            max={parseFloat(this.props.treshold)}
            value={this.state.value}
            orientation="horizontal"
            onChange={this.handleChange}
          />
          <button
            className="value-button"
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseDown={this.onMouseDown.bind(this, 'more')}
            onTouchEnd={this.onMouseUp.bind(this)}
            onTouchCancel={this.onMouseUp.bind(this)}
            onTouchStart={this.onMouseDown.bind(this, 'more')}>
            <FontAwesomeIcon icon={['fas', 'plus']} size="1x" />
          </button>
        </div>
      </div>
    );
  }
}

SetCounter.propTypes = {
  treshold: PropTypes.number.isRequired
};

export default SetCounter;
