import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExerciseListing from '../blocks/ExerciseListing';
import Timestamper from '../blocks/Timestamper';

class WorkoutHistoryDetail extends Component {
  render() {
    const workoutExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;

    const listExercises = workoutExercices.map((value) => {
      return <ExerciseListing key={value.exerciceId.toString()} exerciseData={value} exercisesDatabase={exercisesDatabase} status="past" />
    });

    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.contents.routineName}</h3>
        </div>
        <div className="panel-body">
          {listExercises}
        </div>
        <div className="panel-footer">
          <Timestamper timestamp={this.props.contents.timestamp * 1000} />
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
