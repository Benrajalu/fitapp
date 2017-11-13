import React, { Component } from 'react';
import {Prompt, Redirect} from 'react-router';
import { Link } from 'react-router-dom';
import {firebaseAuth, database} from '../utils/fire';

import WorkoutDetails from '../blocks/WorkoutDetails';
import WorkoutExit from '../blocks/WorkoutExit';

import '../styles/Workout.css';

class Workout extends Component {
  constructor(props, match) {
    super(props);
    this.state = {
      loading:true,
      routineId: this.props.match ? this.props.match.params.id : undefined, 
      routine: {},
      records: [],
      user: {
        uid: firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : "0",
        settings:{}
      }, 
      exercisesDatabase: [], 
      workoutLog: {}, 
      changedRoutine: false, 
      runningWorkout: "running", 
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

  userListener(){
    const _this = this, 
          user = this.state.user;

    this.fireUserListener = database.collection('users').doc(user.uid).get().then((doc) => {
      if(doc.exists){
        const cleanUser = doc.data();
        cleanUser.uid = user.uid;
        _this.setState({
          user:cleanUser
        });
      }
    });
  }

  routineListener(){
    const _this = this, 
          user = this.state.user, 
          routine = this.props.match.params.id,
          today = new Date();

    this.fireRoutineListener = database.collection('users').doc(user.uid).collection('routines').doc(routine).get().then((doc) => {
      if(doc.exists){
        const cleanRoutine = doc.data();
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

        _this.setState({
          routine: cleanRoutine, 
          workoutLog:{
            "color": cleanRoutine.color,
            "id": "log-" + today.getTime(), 
            "routineName": cleanRoutine.name, 
            "timestamp": today.getTime(), 
            "exercises": logExercises
          }
        });
      }
      else{
        _this.setState({
          routine: false, 
          workoutLog: false
        })
      }
    });
  }

  recordsListener(){
    const _this = this, 
          user = this.state.user;

    this.fireRecordsListener = database.collection('users').doc(user.uid).collection('personalRecords').get().then((snapshot) => {
      if(snapshot && snapshot.length > 0){
        const output = [];
        snapshot.forEach((doc) => {
          output.push(doc.data());
        });
        _this.setState({
          records: output
        })
      }
      else{
        _this.setState({
          records:[]
        })
      }
    });
  }

  exercisesListener(){
    const _this = this;

    this.fireExercisesListener = database.collection('exercises').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        output.push(doc.data());
      });
      _this.setState({
        exercisesDatabase: output, 
        loading:false
      })
    });
  }

  componentWillMount() {
    // Binding the listeners created above to this component
    this.userListener = this.userListener.bind(this);
    this.userListener();

    this.routineListener = this.routineListener.bind(this);
    this.routineListener();

    this.recordsListener = this.recordsListener.bind(this);
    this.recordsListener();

    this.exercisesListener = this.exercisesListener.bind(this);
    this.exercisesListener();
  }

  compontentWillUnmout(){
    // Removing the bindings and stopping the events from poluting the state
    this.routineListener = undefined;
    this.userListener = undefined;
    this.recordsListener = undefined;
    this.exercisesListener = undefined;
  }

  updateRoutine(index, event){
    console.log("coucou");
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
    const _this = this, 
          today = new Date();

    this.setState({
      runningWorkout: "saving"
    });
    
    const dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate(), 
          mm = today.getMonth()+1 < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1,
          yyyy = today.getFullYear(),
          fullDate = dd+'/'+mm+'/'+yyyy;
    
    // If there are some exercises the user can upgrade, then we work out which ones and by how much...
    if(this.state.upgradeRoutine){
      const routine = this.state.routine, 
            areUpdatable = this.state.upgradeRoutine;

      // It's also time to update the personal recoards, you great great warrior
      const records = this.state.records;
      
      for(var x = 0; x < areUpdatable.length; x ++){
        let current = routine.exercises[areUpdatable[x]], 
            type = this.state.exercisesDatabase.filter(obj => obj.id === current.exerciseId)[0].type;

        // Updating the routine...
        if(type === "cardio"){
          routine.exercises[areUpdatable[x]].handicap = parseFloat(routine.exercises[areUpdatable[x]].handicap) + 10;
        }
        else if (type === "barbell" || type === "calisthenics"){
          routine.exercises[areUpdatable[x]].handicap = parseFloat(routine.exercises[areUpdatable[x]].handicap) + 5;
        }
        else{
          routine.exercises[areUpdatable[x]].handicap = parseFloat(routine.exercises[areUpdatable[x]].handicap) + 2;  
        }
        
        // Updating the records...
        if(type === "barbell" || type === "cable" || type === "dumbbell"){
          const newRecordValue = parseFloat(routine.exercises[areUpdatable[x]].handicap);

          // Check if that exercise is already in records 
          const recordsHistory = records.findIndex(obj => obj.exerciseId === current.exerciseId ); 
          if(recordsHistory >= 0){
            const oldValue = parseFloat(records[recordsHistory].record.replace('kg', ''));
            if(oldValue < newRecordValue){
              records[recordsHistory].record = newRecordValue + 'kg';
              records[recordsHistory].timestamp = Date.now();
            }
          }
          else{
            const newRecord = {
              exerciseId: current.exerciseId, 
              record: newRecordValue + 'kg',
              timestamp:  Date.now()
            }
            records.push(newRecord);
          }
        }
      }


      this.setState({
        records: records,
        routine: routine 
      });


      // ... then we add to the payload
      this.state.records.map((obj) => {
        return database.collection('users').doc(_this.state.user.uid).collection('personalRecords').doc(obj.exerciseId).set(obj, { merge: true });
      });
      database.collection('users').doc(this.state.user.uid).collection('routines').doc(this.state.routine.routineId.toString()).set(this.state.routine, { merge: true });
    }

    // If the routine was changed (handicaps) and the user wants that saved, save it
    if(this.state.saveRoutine){
      const routineSnapshot = this.state.routine, 
            workout = this.state.workoutLog;
      workout.exercises.map((value, index) => {
        return routineSnapshot.exercises[index].handicap = value.handicap;
      })
      this.setState({
        routine: routineSnapshot
      }, () => {
        database.collection('users').doc(_this.state.user.uid).collection('routines').doc(_this.state.routine.routineId.toString()).set(_this.state.routine);
      });
    }
    
    // This is the basic payload, saved whatever happens
    // we use the fullDate to update the targeted routine so users know it's the most recently used
    // and we use the state.workout to save into the workout logs so this workout is part of the user's history
    database.collection('users').doc(this.state.user.uid).collection('routines').doc(this.state.routine.routineId.toString()).update({
      "lastPerformed" : fullDate
    }).then(() => {
      database.collection('users').doc(_this.state.user.uid).collection('workoutLog').add(_this.state.workoutLog).then(() => {
        _this.setState({
          runningWorkout:false
        });
        setTimeout(() => {
          _this.setState({
            successRedirect:true
          });
        }, 1500);
      })
    });

  }

  render() {
    const currentRoutine = this.state.workoutLog;
    
    // For each exercise in the routine, we display a workoutDetails element that will enable users to track their routine
    const workoutItems = currentRoutine.exercises ? currentRoutine.exercises.map((value, index) => 
      <WorkoutDetails key={value.exerciseId + '-' + index} contents={value} exercisesDatabase={this.state.exercisesDatabase} index={index} onUpdate={this.updateRoutine} onReps={this.feedReps} settings={this.state.user.settings}/>
    ) : false;

    let workoutExit = <WorkoutExit runningStatus={this.state.runningWorkout ? this.state.runningWorkout : "exiting"} 
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
      <div id="Workout">
        { this.state.routine === false ? 
          <div>
            <div className="container">
              <div className="page-header">
                <Link to="/" title="Retour au dashboard"><i className="fa fa-angle-left"></i></Link>
                <h1>Entraînement <small>{this.state.routine.name}</small></h1>
              </div>
            </div>
            <div className="container empty">
              <div className="panel alert">
                <div className="panel-body">
                  <p>Cet entraînement n'existe pas !</p>
                  <Link to="/" className="btn btn-green">Retour à l'accueil</Link>
                </div>
              </div> 
            </div>
          </div>
          :
          <div className="hard-lock">
            <Prompt when={this.state.runningWorkout ? true : false} message="Vous n'avez pas terminé cet entrainement. Souhaitez-vous l'annuler ? " /> 
            {this.state.successRedirect ? <Redirect push to={{ pathname:'/'}} /> : false }
            <div className="container">
              <div className="page-header">
                <Link to="/" title="Retour au dashboard"><i className="fa fa-angle-left"></i></Link>
                <h1>Entraînement <small>{this.state.routine.name}</small></h1>
              </div>
            </div>
            <div className="container workout-wrapper">
              {this.state.loading || this.state.routine.exercises.length < 1 || this.state.exercisesDatabase.length < 1 ? 
                <div className="container empty workout-list">
                  <div className="inlineLoader"><p>Chargement du programme...</p></div>
                </div>
                :
                <div className="routine-detail">
                  <div className="routine-heading with-actions">
                    <div className="description">
                      <h3 className="title">{this.state.routine.name}</h3>
                      <i className="color-spot" style={{"backgroundColor" : this.state.routine.color}}></i>
                    </div>
                    <button className="action" onClick={this.endRoutine}>Terminer l'entraînement</button>
                  </div>
                  <div className="routine-body workout">
                    {workoutItems}
                  </div>
                </div>
              }
            </div>
            {this.state.exitingRoutine ? workoutExit : false}
          </div>
        }
      </div>
    )
  }
}

export default Workout;
