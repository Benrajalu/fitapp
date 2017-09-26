import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ExerciseListing from '../blocks/ExerciseListing';


class RoutineDetail extends Component {
  render() {
    const routineExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;
    const listExercises = routineExercices.map((value, index) => {
      return <ExerciseListing key={value.exerciseId.toString() + '-' + index} exerciseData={value} exercisesDatabase={exercisesDatabase} />
    });

    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading container-fluid">
          <div className="col-md-8">
            <h3 className="panel-title">{this.props.contents.name}</h3>
          </div>
          <div className="col-md-4 text-right">
            <Link to={'/workout/' + this.props.contents.id} className="btn btn-primary">Débuter l'entraînement</Link>&nbsp;
            {this.props.editable ? <Link to={'/edit/' + this.props.contents.id} className="btn btn-default">Edit</Link> : false}
          </div>
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
