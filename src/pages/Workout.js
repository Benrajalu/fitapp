import React, { Component } from 'react';
import {Prompt} from 'react-router';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import WorkoutDetails from '../blocks/WorkoutDetails';
import WorkoutUpdates from '../blocks/WorkoutUpdates';

class Workout extends Component {
  constructor(props, match) {
    super(props);
    this.state = {
      routineId: this.props.match ? this.props.match.params.id : undefined, 
      routine: {},
      user: [], 
      exercisesDatabase: [], 
      changedRoutine: false, 
      workoutLog: {}, 
      runningWorkout: true, 
      upgradeRoutine: false,
      exitingRoutine: false
    };

    this.updateRoutine = this.updateRoutine.bind(this);
    this.feedReps = this.feedReps.bind(this);
    this.endRoutine = this.endRoutine.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
    this.routineUpdateToggle = this.routineUpdateToggle.bind(this)
    this.closeRoutineModal = this.closeRoutineModal.bind(this);
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
    let changedName = event.target["name"],
          changedValue = event.target.value;

    if(changedName === "handicap" && changedValue <= 0){
      changedValue = 1;
    }

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
    });
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

  endRoutine(){
    // First, check if any set has been completed
    const log = this.state.workoutLog.exercises, 
          completedExercises = [];
    
    for(let i = 0; i < log.length; i++){
      // Check if this has a repTargt. If it's cardio, the target IS the handicap
      let repTarget = log[i].repTarget ? parseFloat(log[i].repTarget) : parseFloat(log[i].handicap), 
          successFullSets = log[i].sets.filter(value => value === repTarget);
      if(log[i].sets.length === successFullSets.length){
        // If all repored reps are equal the target, on all sets, then push the exercise index to the array
        completedExercises.push(i);
      }
    }

    if(completedExercises.length !== 0){
      console.log('Some exercises can upgrade !')
      this.setState({
        upgradeRoutine: completedExercises
      })
    }

    // Then let's check for changes made to the routine
    if(this.state.changedRoutine){
      console.log('routine has been changed !')
      this.setState({
        saveRoutine: true
      })
    }


    this.setState({
      exitingRoutine:true
    })
  }

  cancelUpdate(data){
    let updatables = this.state.upgradeRoutine, 
          index = updatables.indexOf(data);
    updatables.splice(index, 1);

    if(updatables.length === 0){
      updatables = false;
    }
    this.setState({
      upgradeRoutine: updatables
    });
  }

  routineUpdateToggle(){
    this.setState({
      saveRoutine: !this.state.saveRoutine
    })
  }

  closeRoutineModal(){
    this.setState({
      exitingRoutine: !this.state.exitingRoutine   
    })
  }

  render() {
    const currentRoutine = this.state.routine;
    const displayLimit = currentRoutine.exercises ? currentRoutine.exercises.length : 0;
    
    // For each exercise in the routine, we display a workoutDetails element that will enable users to track their routine
    const workoutItems = currentRoutine.exercises ? currentRoutine.exercises.slice(0, displayLimit).map((value, index) => 
      <WorkoutDetails key={value.exerciceId + '-' + index} contents={value} exercisesDatabase={exercisesDatabase} index={index} onUpdate={this.updateRoutine} onReps={this.feedReps} settings={this.state.user.settings}/>
    ) : false;

    // If some exercise are elehible for updates, we define by how much and set up their comonents
    const completedExercises = this.state.upgradeRoutine, 
          allExercises = currentRoutine.exercises;
    const updates = completedExercises ? completedExercises.map((value, index) => 
      <WorkoutUpdates key={'log-' + index + '-' + value} completedSet={value} allSets={allExercises} database={this.state.exercisesDatabase} notUpdating={this.cancelUpdate}/>
    ) : false;

    const workoutExit = <div className="popin visible">
      <div className="contents">
        <div className="panel panel-success">
          <div className="panel-heading">
            <h3 className="panel-title">Terminer l'entraînement ?</h3>
            <button className="closer" onClick={this.closeRoutineModal}>Close</button>
          </div>
          <div className="panel-body">
            <p>Votre entraînement est terminé ? Félicitations !</p>
            {this.state.changedRoutine ?  
              <div>
                <hr/>
                <p>Vous avez changé certains poids pour cet entrainement. souhaitez vous enregistrer ces modifications ? </p>
                <input type="checkbox" name="saveRoutine" value="yes" checked={this.state.saveRoutine ? true : false} onChange={this.routineUpdateToggle}/>
                <label onClick={this.routineUpdateToggle}>Oui</label>
              </div>
            : false }
            {this.state.upgradeRoutine ?  
              <div>
                <hr/>
                <p>Vous avez atteint vos objectifs ! souhaitez-vous augmenter la difficulté de cet entrainement ?</p>
                {updates}
              </div>
            : false }
            <hr/>
            <button className="closer" onClick={this.closeRoutineModal}>Valider</button>
            <button className="closer" onClick={this.closeRoutineModal}>Annuler</button>
          </div>
        </div>
      </div>
    </div>

    return (
      <div className="Workout">
        <Prompt when={this.state.runningWorkout} message="Vous n'avez pas terminé cet entrainement. Souhaitez-vous l'annuler ? " /> 
        <div className="container">
          <div className="page-header">
            <h1>Entraînement <small>{currentRoutine.name}</small></h1>
            <button className="btn btn-primary" onClick={this.endRoutine}>Terminer l'entraînement</button>
          </div>
          {workoutItems}
          <button className="btn btn-primary" onClick={this.endRoutine}>Terminer l'entraînement</button>
        </div>
        {this.state.exitingRoutine ? workoutExit : false}
      </div>
    )
  }
}

export default Workout;
