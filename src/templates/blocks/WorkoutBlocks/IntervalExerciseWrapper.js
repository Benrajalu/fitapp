import React, { Component } from "react";
import PropTypes from "prop-types";

class IntervalExerciseWrapper extends Component {
  render() {
    const { setList, current, timeSpent, timeFormater, previous } = this.props;

    const currentExercise = setList[current.exerciseIndex];
    const remainingTime = current.ends - timeSpent;

    const circleCircumference = Math.PI * (148 * 2);
    // (currentCounter / targetLenght ) * 100 = x
    const percent = previous
      ? ((timeSpent - previous.ends) / current.length) * 100
      : 0;
    const progressOffset =
      circleCircumference - (percent / 100) * circleCircumference;

    return (
      <div className={`interval-exercice`}>
        <div className="interval-body">
          <div className="counter">
            <h3 className="counter-title">Exercice</h3>
            <p className="counter-value">{currentExercise.name}</p>
          </div>
          <div className="counter">
            <h3 className="counter-title">Série</h3>
            <p className="counter-value">
              {current.setIndex + 1}/{setList[current.exerciseIndex].sets}
            </p>
          </div>
          <div className="counter-big">
            <p className="big-value">{timeFormater(remainingTime)}</p>
            <p
              className={`small-value ${
                current.legend === "Active" ? "active" : "pause"
              }`}
            >
              {current.legend}
            </p>
          </div>
        </div>

        <div className="circle-zone">
          <div className="completion">
            <svg
              viewBox="0 0 300 300"
              maintainaspectratio="true"
              className="circular-chart"
            >
              <circle
                cx="150"
                cy="150"
                r="148"
                strokeWidth="0"
                className="circle-bg"
              />
              <circle
                cx="150"
                cy="150"
                r="148"
                className="circle"
                style={{
                  strokeDashoffset: progressOffset ? progressOffset : 0,
                  strokeDasharray: `${circleCircumference} ${circleCircumference}`
                }}
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

IntervalExerciseWrapper.propTypes = {
  current: PropTypes.object.isRequired,
  previous: PropTypes.object.isRequired,
  setList: PropTypes.array.isRequired,
  timeFormater: PropTypes.func.isRequired,
  timeSpent: PropTypes.number.isRequired
};

export default IntervalExerciseWrapper;
