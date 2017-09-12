import React, { Component } from 'react';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import WorkoutDetails from '../blocks/WorkoutDetails';

class Workout extends Component {
  constructor(props, match) {
    super(props);
    this.state = {
      routineId: this.props.match ? this.props.match.params.id : undefined, 
      routine: {},
      user: [], 
      exercisesDatabase: []
    }
  }

  componentDidMount() {
    this.setState({
      user: userData[0],
      exercisesDatabase: exercisesDatabase, 
      routine: userData[0].routines.filter(obj => obj.id === this.state.routineId )[0]
    });
  }
  render() {
    const currentRoutine = this.state.routine;
    const displayLimit = currentRoutine.exercises ? currentRoutine.exercises.length : 0;

    const workoutItems = currentRoutine.exercises ? currentRoutine.exercises.slice(0, displayLimit).map((value, index) => 
      <WorkoutDetails key={value.exerciceId + '-' + index} contents={value} exercisesDatabase={exercisesDatabase} index={index} />
    ) : false;

    return (
      <div className="Workout">
        <div className="container">
          <div className="page-header">
            <h1>Entraînement <small>{currentRoutine.name}</small></h1>
          </div>
          {workoutItems}
        </div>
      </div>
    )
  }
}

export default Workout;
