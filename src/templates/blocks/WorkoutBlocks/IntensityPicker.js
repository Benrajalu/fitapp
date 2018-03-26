import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class IntensityPicker extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.printLevel = this.printLevel.bind(this);
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

  printLevel(level) {
    let copy;
    switch (level) {
      case 1:
        copy = 'Effort léger, rythme cardiaque proche du repos.';
        break;

      case 2:
        copy = "Effort moderé, rythme cardiaque d'une marche rapide.";
        break;

      case 3:
        copy = 'Effort et rythme cardiaque soutenus.';
        break;

      case 4:
        copy = 'Effort intense, rythme cardiaque élevé.';
        break;

      default:
        copy = 'Effort léger, rythme cardiaque proche du repos.';
    }
    return copy;
  }

  render() {
    return (
      <Fragment>
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
        <p>{this.printLevel(this.state.value)}</p>
      </Fragment>
    );
  }
}

IntensityPicker.propTypes = {
  updateIntensity: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};

export default IntensityPicker;
