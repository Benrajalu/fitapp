import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RecordBadge from '../blocks/RecordBadge';

class RecordsLog extends Component {
  render() {
    const recordsList = this.props.list;
    const exercisesDatabase = this.props.exercisesDatabase;
    const displayLimit= this.props.limit ? this.props.limit : recordsList.length;

    const recordsItems = recordsList.slice(0, displayLimit).map((value, index) => 
      <RecordBadge key={value.exerciseId + '-' + index} contents={value} exercisesDatabase={exercisesDatabase} delay={index * 100}/>
    );

    return (
      <div className="RecordsLog">
        {recordsItems}
      </div>
    )
  }
}

RecordsLog.propTypes = {
  list: PropTypes.array.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default RecordsLog;
