import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class IntensityPicker extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
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
    this.props.updateIntensity(data);
    this.setState({
      value: data
    });
  }

  render() {
    return (
      <div className="intensity">
        <Slider
          min={1}
          max={4}
          value={this.state.value}
          orientation="horizontal"
          onChange={this.handleChange}
        />
        <div className="level">
          <p className="value">
            <span>lvl</span>
            {this.state.value}
          </p>
        </div>
      </div>
    );
  }
}

IntensityPicker.propTypes = {};

export default IntensityPicker;
