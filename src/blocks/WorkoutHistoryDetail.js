import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExerciseListing from '../blocks/ExerciseListing';
import Timestamper from '../blocks/Timestamper';

import "../styles/routine.css"

class WorkoutHistoryDetail extends Component {
  render() {
    const workoutExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;

    const listExercises = workoutExercices.map((value) => {
      return <ExerciseListing key={value.exerciseId.toString()} exerciseData={value} exercisesDatabase={exercisesDatabase} status="past" />
    });

    return (
      <div className="routine-detail">
        <div className="routine-heading">
          <Timestamper timestamp={this.props.contents.timestamp.toString().length !== 13 ? this.props.contents.timestamp * 1000 : this.props.contents.timestamp} />
          <h3 className="title">{this.props.contents.routineName}</h3>
          <i className="color-spot" style={{"backgroundColor" : this.props.contents.color}}></i>
        </div>
        <div className="routine-body log">
          {listExercises}
        </div>
      </div>
    )
  }
}

WorkoutHistoryDetail.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default WorkoutHistoryDetail;
