import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExerciseListing from '../blocks/ExerciseListing';
import Timestamper from '../blocks/Timestamper';

class WorkoutHistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.calorieCounter = this.calorieCounter.bind(this);
    this.state = {
      getIn: {
        transform: 'translateX(-30%)',
        opacity: 0
      }
    };
  }
  componentDidMount() {
    const _this = this;
    setTimeout(() => {
      _this.setState({
        getIn: {
          transform: 'translateX(0)',
          opacity: '1'
        }
      });
    }, this.props.delay);
  }

  calorieCounter() {
    const userWeight = parseFloat(this.props.user.userWeight),
      timeActive = (this.props.contents.time / 60).toFixed(2),
      intensity = this.props.contents.intensity
        ? this.props.contents.intensity + 2
        : 3;

    let formula = intensity * 3.5 * userWeight / 1000 * 5 * timeActive;

    return Math.floor(formula - formula * 0.3);
  }

  render() {
    const workoutExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;

    const listExercises = workoutExercices.map((value, index) => {
      return (
        <ExerciseListing
          key={index}
          exerciseData={value}
          exercisesDatabase={exercisesDatabase}
          status="past"
        />
      );
    });

    return (
      <div className="routine-detail" style={this.state.getIn}>
        <div className="routine-heading">
          <h3 className="title">{this.props.contents.routineName}</h3>
          <Timestamper
            timestamp={
              this.props.contents.timestamp.toString().length !== 13
                ? this.props.contents.timestamp * 1000
                : this.props.contents.timestamp
            }
          />
        </div>
        <div className="routine-body log">
          <div className="routine-breakdown">
            <p>
              <strong>{workoutExercices.length}</strong> exercice{workoutExercices.length >
              1
                ? 's'
                : false}
            </p>
            {this.props.contents.time ? (
              <p>
                <strong>{(this.props.contents.time / 60).toFixed(2)}</strong>{' '}
                minutes
              </p>
            ) : (
              false
            )}
            {this.props.user.userWeight && this.props.contents.time ? (
              <p>
                <strong>{this.calorieCounter()}</strong> kcalories
              </p>
            ) : (
              false
            )}
          </div>
          <div className="routine-exercices">
            <div className="list">{listExercises}</div>
          </div>
        </div>
      </div>
    );
  }
}

WorkoutHistoryDetail.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
};

export default WorkoutHistoryDetail;
