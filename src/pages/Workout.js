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
      changedRoutine: false, 
      workoutLog: {}
    };

    this.updateRoutine = this.updateRoutine.bind(this);
    this.feedReps = this.feedReps.bind(this);
  }

  componentDidMount() {
    // We start by timestamping and getting the clean routine from the user DB using the URL param
    const today = new Date(), 
          cleanRoutine = userData[0].routines.filter(obj => obj.id === this.state.routineId )[0];
    
    // Setting up a mock version of the workout log (for history) of the current exercises...
    let logExercises = [];
    // ...then mapping the routine's infos into it
    cleanRoutine.exercises.map((value) => 
      logExercises.push({
        exerciceId: value.exerciceId, 
        repTarget: value.reps ? value.reps : false,
        handicap: value.handicap ? value.handicap : 0
      })
    )

    this.setState({
      user: userData[0],
      exercisesDatabase: exercisesDatabase, 
      routine: cleanRoutine, 
      workoutLog:{
        "id": "log-" + today.getTime(), 
        "routineName": userData[0].routines.filter(obj => obj.id === this.state.routineId )[0].name, 
        "timestamp": today.getTime(), 
        "exercises": logExercises
      }
    });

    this.setState({

    })
  }

  updateRoutine(index, event){
    // When the workout detail component wants to update handicaps, we do it here
    const changedName = event.target["name"],
          changedValue = event.target.value;

    const routineSnapshot = this.state.routine,
          logSnapshot = this.state.workoutLog;

    routineSnapshot.exercises[index][changedName] = changedValue;
    logSnapshot.exercises[index][changedName] = changedValue;
    
    // Updating the routine has "changed" flags it for a possible overwrite of the old routine in the DB later on
    // We update both the routine (because we'll offer to save its new format) and the change into the workout log for posterity
    this.setState({
      routine: routineSnapshot, 
      workoutLog: logSnapshot, 
      changedRoutine: true
    })
  }

  feedReps(data, index){
    // The workoutDetail element (so each exercises) will communicate to us how many reps it should get, and how many are actually done
    // This gets then recorded into the current workout log
    const logSnapshot = this.state.workoutLog;
    logSnapshot.exercises[index].sets = data;
    this.setState({
      workoutLog: logSnapshot
    });
  }

  render() {
    const currentRoutine = this.state.routine;
    const displayLimit = currentRoutine.exercises ? currentRoutine.exercises.length : 0;
    
    // For each exercise in the routine, we display a workoutDetails element that will enable users to track their routine
    const workoutItems = currentRoutine.exercises ? currentRoutine.exercises.slice(0, displayLimit).map((value, index) => 
      <WorkoutDetails key={value.exerciceId + '-' + index} contents={value} exercisesDatabase={exercisesDatabase} index={index} onUpdate={this.updateRoutine} onReps={this.feedReps} settings={this.state.user.settings}/>
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
