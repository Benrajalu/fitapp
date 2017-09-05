import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RecordBadge extends Component {
  render() {
    const data = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(obj => obj.id === data.exerciseId )[0];

    console.log(data);


    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading">
          <h3 className="panel-title">{trueExercise.name}</h3>
        </div>
        <div className="panel-body">
          <p><strong>{data.record}</strong></p>
        </div>
      </div>
    )
  }
}

RecordBadge.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default RecordBadge;
