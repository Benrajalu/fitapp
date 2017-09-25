import React, { Component } from 'react';
import {Prompt, Redirect} from 'react-router';

import axios from 'axios';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import WorkoutDetails from '../blocks/WorkoutDetails';
import WorkoutExit from '../blocks/WorkoutExit';

class Workout extends Component {
  constructor(props, match) {
    super(props);
    this.state = {
      routineId: this.props.match ? this.props.match.params.id : undefined, 
      routine: {},
      user: [], 
      exercisesDatabase: [], 
      workoutLog: {}, 
      changedRoutine: false, 
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
    this.saveRoutine = this.saveRoutine.bind(this);
  }

  componentDidMount() {
    // We start by timestamping and getting the clean routine from the user DB using the URL param
    const today = new Date(), 
          cleanRoutine = userData[0].routines.filter(obj => obj.id === this.props.match.params.id )[0];
    
    // Setting up a mock version of the workout log (for history) of the current exercises...
    let logExercises = [];
    // ...then mapping the routine's infos into it
    cleanRoutine.exercises.map((value) => 
      logExercises.push({
        exerciseId: value.exerciseId, 
        repTarget: value.reps ? value.reps : false,
        setsTarget: value.sets ? value.sets : false,
        handicap: value.handicap ? value.handicap : 0
      })
    );

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
  }

  updateRoutine(index, event){
    // When the workout detail component wants to update handicaps, we do it here
    let changedName = event.target["name"],
        changedValue = event.target.value;

    if(changedName === "handicap" && changedValue <= 0){
      changedValue = 1;
    }

    const logSnapshot = this.state.workoutLog;

    logSnapshot.exercises[index][changedName] = changedValue;
    
    // Updating the routine has "changed" flags it for a possible overwrite of the old routine in the DB later on
    // We update both the routine (because we'll offer to save its new format) and the change into the workout log for posterity
    this.setState({
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

  cancelUpdate(data){
    // Whe users want to cancel a planned upgrade to one of their sets, we use this tu remove the set from the upgradeRoutine array
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

    if(completedExercises.length !== 0 && !this.state.changedRoutine){
      // Some exercises can upgrade !
      this.setState({
        upgradeRoutine: completedExercises,
        exitingRoutine:true,
        saveRoutine: false 
      })
    }
    else if(completedExercises.length !== 0 && this.state.changedRoutine){
      // Then let's check for changes made to the routine AND some have been maxed out
      this.setState({
        upgradeRoutine: completedExercises,
        saveRoutine: true, 
        exitingRoutine:true
      })
    }
    else if(this.state.changedRoutine){
      // routine has been changed but no set has been completed
      this.setState({
        saveRoutine: true, 
        exitingRoutine:true,
        upgradeRoutine:false
      })
    }
    else{
      this.setState({
        exitingRoutine:true,
        upgradeRoutine:false,
        saveRoutine: false 
      })   
    }
  }

  saveRoutine(){
    const userId = this.state.user.id, 
          _this = this, 
          workout = this.state.workoutLog, 
          today = new Date();
    
    const dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate(), 
          mm = today.getMonth()+1 < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1,
          yyyy = today.getFullYear(),
          fullDate = dd+'/'+mm+'/'+yyyy;
    
    // This is the basic payload, saved whatever happens
    // routineId and timestamp update the targeted routine so users know it's the most recently used
    // workout saves into the workout logs so this workout is part of the user's history
    let serverPayload = {
      method: 'post', 
      url: '',
      data: {
        userId: userId, 
        workout: workout, 
        routineId: this.state.routine.id, 
        timestamp: fullDate
      }  
    }

    // First, if the routine was changed (handicaps) and the user wants that saved, save it
    if(this.state.saveRoutine){
      const routineSnapshot = this.state.routine, 
            workout = this.state.workoutLog;

      workout.exercises.map((value, index) => {
        return routineSnapshot.exercises[index].handicap = value.handicap;
      })

      this.setState({
        routine: routineSnapshot
      })

      serverPayload.data.updateRoutine = this.state.routine;
    }

    // If there are some exercises the user wants to upgrade, then we work out which ones and by how much...
    if(this.state.upgradeRoutine){
      const routine = this.state.routine, 
            areUpdatable = this.state.upgradeRoutine;
      
      for(var x = 0; x < areUpdatable.length; x ++){
        let current = routine.exercises[areUpdatable[x]], 
            type = this.state.exercisesDatabase.filter(obj => obj.id === current.exerciseId)[0].type;


        if(type === "cardio"){
          routine.exercises[areUpdatable[x]].handicap = parseFloat(routine.exercises[areUpdatable[x]].handicap) + 10;
        }
        else if (type === "barbell" || type === "calisthenics"){
          routine.exercises[areUpdatable[x]].handicap = parseFloat(routine.exercises[areUpdatable[x]].handicap) + 5;
        }
        else{
          routine.exercises[areUpdatable[x]].handicap = parseFloat(routine.exercises[areUpdatable[x]].handicap) + 2;  
        }
      }
      this.setState({
        routine: routine
      });

      // ... then we add to the payload
      serverPayload.data.updateRoutine = this.state.routine;
    }

    // Regardless of all that, we save the workoutLog then exit to home
    axios(serverPayload)
    .then(function(response){
      console.log("Workout is done ! Use the sequence mocked below !");
      console.log(response);
    })
    .catch(function(error){
      console.log("That's a FALSE pass : " + error.message);
      console.log(serverPayload);
      // Mock success still 
      _this.setState({
        runningWorkout:false
      });
      setTimeout(() => {
        _this.setState({
          successRedirect:true
        });
      }, 1500);
    })

  }

  render() {
    const currentRoutine = this.state.workoutLog;
    
    // For each exercise in the routine, we display a workoutDetails element that will enable users to track their routine
    const workoutItems = currentRoutine.exercises ? currentRoutine.exercises.map((value, index) => 
      <WorkoutDetails key={value.exerciseId + '-' + index} contents={value} exercisesDatabase={exercisesDatabase} index={index} onUpdate={this.updateRoutine} onReps={this.feedReps} settings={this.state.user.settings}/>
    ) : false;

    let workoutExit = <WorkoutExit runningStatus={this.state.runningWorkout} 
                                   closeRoutineModal={this.closeRoutineModal} 
                                   changedRoutine={this.state.changedRoutine} 
                                   saveRoutine={this.state.saveRoutine ? this.state.saveRoutine : false} 
                                   routineUpdateToggle={this.routineUpdateToggle}
                                   upgradeRoutine={this.state.upgradeRoutine}
                                   currentRoutine={this.state.workoutLog}
                                   originalRoutine={this.state.routine}
                                   exercisesDatabase={this.state.exercisesDatabase}
                                   cancelUpdate={this.cancelUpdate}
                                   writeRoutine={this.saveRoutine} />;
    return (
      <div className="Workout">
        <Prompt when={this.state.runningWorkout} message="Vous n'avez pas terminé cet entrainement. Souhaitez-vous l'annuler ? " /> 
        {this.state.successRedirect ? <Redirect push to={{ pathname:'/'}} /> : false }
        <div className="container">
          <div className="page-header">
            <h1>Entraînement <small>{this.state.routine.name}</small></h1>
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
