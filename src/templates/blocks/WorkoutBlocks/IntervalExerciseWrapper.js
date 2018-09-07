import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class IntervalExerciseWrapper extends Component {

  render() {
    const {
      setList,
      current,
      timeSpent,
    } = this.props;

    const currentExercise = setList[current.exerciseIndex];
    const remainingTime = current.ends - timeSpent;

    return (
      <div
        className={`interval-exercice`}>
        <div className="interval-heading">
          <p className="index">
            Exo. {current.exerciseIndex + 1}/{setList.length}
          </p>
          <h2 className="name">{currentExercise.name}</h2>
        </div>
        <div className="interval-body">
          <div className="counter">
            <h3 className="counter-title">Restant</h3>
            <p className="counter-value">
              {remainingTime >= 10 ? remainingTime : `0${remainingTime}`} secondes
            </p>
          </div>
          <div className="counter">
            <h3 className="counter-title">Série</h3>
            <p className="counter-value">
              {current.setIndex + 1}/{setList[current.exerciseIndex].sets}
            </p>
          </div>
          <div className="counter">
            <h3 className="counter-title">Mode</h3>
            <p className="counter-value">
              {current.legend}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

IntervalExerciseWrapper.propTypes = {

};

export default IntervalExerciseWrapper;
