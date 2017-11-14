import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Timestamper from '../blocks/Timestamper';
import '../styles/RecordsLogs.css';

class RecordBadge extends Component {
  render() {
    const data = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(obj => obj.id === data.exerciseId )[0];


    return (
      <div className="records-card">
        <div className="description">
          <h3 className="title">{trueExercise.name}</h3>
          <Timestamper timestamp={this.props.contents.timestamp.toString().length !== 13 ? this.props.contents.timestamp * 1000 : this.props.contents.timestamp} />
        </div>
        <div className="value">
          <p>{data.record}</p>
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
