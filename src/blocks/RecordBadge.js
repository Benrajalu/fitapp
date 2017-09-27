import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Timestamper from '../blocks/Timestamper';

class RecordBadge extends Component {
  render() {
    const data = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(obj => obj.id === data.exerciseId )[0];


    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading">
          <h3 className="panel-title">{trueExercise.name}</h3>
        </div>
        <div className="panel-body">
          <p><strong>{data.record}</strong></p>
        </div>
        <div className="panel-footer">
          <Timestamper timestamp={this.props.contents.timestamp.toString().length !== 13 ? this.props.contents.timestamp * 1000 : this.props.contents.timestamp} />
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
