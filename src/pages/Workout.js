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
      exercisesDatabase: [], 
      changedRoutine: false
    };

    this.updateRoutine = this.updateRoutine.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: userData[0],
      exercisesDatabase: exercisesDatabase, 
      routine: userData[0].routines.filter(obj => obj.id === this.state.routineId )[0]
    });
  }

  updateRoutine(data, event){
    // When the workout detail component wants to update handicaps, we do it here
    const changedName = event.target["name"],
          changedValue = event.target.value;

    const routineSnapshot = this.state.routine;
    routineSnapshot.exercises[data][changedName] = changedValue;
    
    // Updating the routine has "changed" flags it for a possible overwrite of the old routine in the DB later on
    this.setState({
      routine: routineSnapshot, 
      changedRoutine: true
    })

    console.log(this.state.routine);
  }

  render() {
    const currentRoutine = this.state.routine;
    const displayLimit = currentRoutine.exercises ? currentRoutine.exercises.length : 0;
    
    // For each exercise in the routine, we display a workoutDetails element that will enable users to track their routine
    const workoutItems = currentRoutine.exercises ? currentRoutine.exercises.slice(0, displayLimit).map((value, index) => 
      <WorkoutDetails key={value.exerciceId + '-' + index} contents={value} exercisesDatabase={exercisesDatabase} index={index} onUpdate={this.updateRoutine} />
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
