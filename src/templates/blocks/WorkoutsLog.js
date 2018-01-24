import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WorkoutHistoryDetail from '../blocks/WorkoutHistoryDetail';

class WorkoutsLog extends Component {
  render() {
    const workoutsList = this.props.list;
    const exercisesDatabase = this.props.exercisesDatabase;
    const displayLimit= this.props.limit ? this.props.limit : workoutsList.length;

    const workoutItems = workoutsList.slice(0, displayLimit).map((value, index) => 
      <WorkoutHistoryDetail key={value.id} contents={value} exercisesDatabase={exercisesDatabase} delay={index * 100}/>
    );

    return (
      <div className="WorkoutsLog">
        {workoutItems}
      </div>
    )
  }
}

WorkoutsLog.propTypes = {
  list: PropTypes.array.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default WorkoutsLog;
