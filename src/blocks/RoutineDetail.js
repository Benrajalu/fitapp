import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExerciseListing from '../blocks/ExerciseListing';

class RoutineDetail extends Component {
  render() {
    const routineExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;
    const listExercises = routineExercices.map((value) => {
      return <ExerciseListing key={value.exerciceId.toString()} exerciseData={value} exercisesDatabase={exercisesDatabase} />
    });

    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.contents.name}</h3>
        </div>
        <div className="panel-body">
          {listExercises}
        </div>
      </div>
    )
  }
}

RoutineDetail.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default RoutineDetail;
