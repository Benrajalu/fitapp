import React, { Component, Fragment } from 'react';
import { Prompt, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { firebaseAuth, database } from '../../store';
import { connect } from 'react-redux';
import { watchRoutines } from '../../actions/RoutinesActions';
import { changeLayout } from '../../actions/MenuActions';

import WorkoutDetails from '../blocks/WorkoutDetails';
import WorkoutExit from '../blocks/WorkoutExit';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import InlineLoader from '../blocks/InlineLoader';

import Stopwatch from '../blocks/WorkoutBlocks/Stopwatch';
import WorkoutTabs from '../blocks/WorkoutBlocks/WorkoutTabs';
import WorkoutExerciseTeaser from '../blocks/WorkoutBlocks/WorkoutExerciseTeaser';
import WorkoutExerciseFull from '../blocks/WorkoutBlocks/WorkoutExerciseFull';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    menu: state.menu,
    routines: state.routines,
    exercises: state.exercises,
    workoutLogs: state.workoutLogs,
    match: ownProps.match
  };
};

const mapDispatchToProps = dispatch => {
  return {
    watchRoutines: () => {
      dispatch(watchRoutines());
    },
    changeLayout: layout => {
      dispatch(changeLayout(layout));
    }
  };
};

class Workout extends Component {
  constructor(props, match) {
    super(props);
    this.state = {
      loading: true,
      routineId: this.props.match ? this.props.match.params.id : undefined,
      routine: {},
      workoutLog: {},
      changedRoutine: false,
      runningWorkout: 'running',
      upgradeRoutine: false,
      exitingRoutine: false,
      ongoingExercise: false
    };

    this.getRoutine = this.getRoutine.bind(this);
    this.updateRoutine = this.updateRoutine.bind(this);
    this.feedReps = this.feedReps.bind(this);
    this.endRoutine = this.endRoutine.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
    this.routineUpdateToggle = this.routineUpdateToggle.bind(this);
    this.closeRoutineModal = this.closeRoutineModal.bind(this);
    this.saveRoutine = this.saveRoutine.bind(this);
    this.getCompletedSets = this.getCompletedSets.bind(this);
    this.getCurrentTime = this.getCurrentTime.bind(this);
    this.showExercise = this.showExercise.bind(this);
  }

  getRoutine(data) {
    const routineId = data.match.params.id;

    var realRoutine = data.routines.routines.filter(
      obj => obj.routineId === parseFloat(routineId)
    );

    if (realRoutine.length > 0) {
      const cleanRoutine = realRoutine[0],
        today = new Date();
      // Setting up a mock version of the workout log (for history) of the current exercises...
      let logExercises = [];
      // ...then mapping the routine's infos into it
      cleanRoutine.exercises.map(value =>
        logExercises.push({
          exerciseId: value.exerciseId,
          repTarget: value.reps ? value.reps : false,
          setsTarget: value.sets ? value.sets : false,
          sets: false,
          handicap: value.handicap ? value.handicap : 0
        })
      );

      this.setState({
        routine: cleanRoutine,
        workoutLog: {
          color: cleanRoutine.color,
          id: 'log-' + today.getTime(),
          routineName: cleanRoutine.name,
          timestamp: today.getTime(),
          exercises: logExercises
        }
      });
    } else {
      this.setState({
        routine: false,
        loading: false,
        workoutLog: false
      });
    }
  }

  componentWillMount() {
    this.getRoutine(this.props);
  }

  componentDidMount() {
    document.title = 'FitApp. - Entraînement en cours !';
    const _this = this;
    this.props.changeLayout('hidden');
    this.setState({
      loading: false
    });
    setTimeout(() => {
      _this.setState({
        mounted: true
      });
    }, 200);
  }

  componentWillReceiveProps(nextProps) {
    this.getRoutine(nextProps);
  }

  componentWillUnmount() {
    this.props.changeLayout('default');
  }

  updateRoutine(index, event) {
    // When the workout detail component wants to update handicaps, we do it here
    let changedName = event.target['name'],
      changedValue = event.target.value;

    if (changedName === 'handicap' && changedValue <= 0) {
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

  getCurrentTime(time) {
    const workoutLog = this.state.workoutLog;
    workoutLog.time = time;
    this.setState({
      workoutLog: workoutLog
    });
  }

  feedReps(data, index) {
    // The workoutDetail element (so each exercises) will communicate to us how many reps it should get, and how many are actually done
    // This gets then recorded into the current workout log
    const logSnapshot = this.state.workoutLog;
    logSnapshot.exercises[index].sets = data;
    this.setState({
      workoutLog: logSnapshot
    });
  }

  cancelUpdate(data) {
    // Whe users want to cancel a planned upgrade to one of their sets, we use this tu remove the set from the upgradeRoutine array
    let updatables = this.state.upgradeRoutine,
      index = updatables.indexOf(data);
    updatables.splice(index, 1);

    if (updatables.length === 0) {
      updatables = false;
    }
    this.setState({
      upgradeRoutine: updatables,
      completedExercises: this.getCompletedSets()
    });
  }

  routineUpdateToggle() {
    this.setState({
      saveRoutine: !this.state.saveRoutine
    });
  }

  closeRoutineModal() {
    this.setState({
      exitingRoutine: !this.state.exitingRoutine
    });
  }

  getCompletedSets() {
    const log = this.state.workoutLog.exercises,
      completedExercises = [];

    for (let i = 0; i < log.length; i++) {
      // Check if this has a repTargt. If it's cardio, the target IS the handicap
      let repTarget = log[i].repTarget
          ? parseFloat(log[i].repTarget)
          : parseFloat(log[i].handicap),
        successFullSets = log[i].sets.filter(value => value === repTarget);
      if (log[i].sets.length === successFullSets.length) {
        // If all repored reps are equal the target, on all sets, then push the exercise index to the array
        completedExercises.push(i);
      }
    }

    return completedExercises;
  }

  endRoutine() {
    // First, check if any set has been completed
    const completedExercises = this.getCompletedSets();

    this.setState(
      {
        completedExercises: completedExercises
      },
      () => {
        if (
          this.state.completedExercises.length !== 0 &&
          !this.state.changedRoutine
        ) {
          // Some exercises can upgrade !
          this.setState({
            upgradeRoutine: completedExercises,
            exitingRoutine: true,
            saveRoutine: false
          });
        } else if (
          this.state.completedExercises.length !== 0 &&
          this.state.changedRoutine
        ) {
          // Then let's check for changes made to the routine AND some have been maxed out
          this.setState({
            upgradeRoutine: completedExercises,
            saveRoutine: true,
            exitingRoutine: true
          });
        } else if (this.state.changedRoutine) {
          // routine has been changed but no set has been completed
          this.setState({
            saveRoutine: true,
            exitingRoutine: true,
            upgradeRoutine: false
          });
        } else {
          this.setState({
            exitingRoutine: true,
            upgradeRoutine: false,
            saveRoutine: false
          });
        }
      }
    );
  }

  saveRoutine() {
    const _this = this,
      today = new Date(),
      workout = this.state.workoutLog;

    workout.timestamp = today.getTime();

    this.setState({
      runningWorkout: 'saving',
      workoutLog: workout
    });

    /* const dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate(), 
          mm = today.getMonth()+1 < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1,
          yyyy = today.getFullYear(),
          fullDate = dd+'/'+mm+'/'+yyyy;*/

    // If some sets have been completed, then we update the user's personal records because they did good
    if (
      this.state.completedExercises &&
      this.state.completedExercises.length > 0
    ) {
      const routine = this.state.workoutLog,
        areUpdatable = this.state.completedExercises,
        records = this.props.workoutLogs.records;

      for (var xb = 0; xb < areUpdatable.length; xb++) {
        let current = routine.exercises[areUpdatable[xb]],
          type = this.props.exercises.list.filter(
            obj => obj.id === current.exerciseId
          )[0].type;

        // Updating the records...
        if (type === 'barbell' || type === 'cable' || type === 'dumbbell') {
          const newRecordValue = parseFloat(
            routine.exercises[areUpdatable[xb]].handicap
          );

          // Check if that exercise is already in records
          const recordsHistory = records.findIndex(
            obj => obj.exerciseId === current.exerciseId
          );
          if (recordsHistory >= 0) {
            const oldValue = parseFloat(
              records[recordsHistory].record.replace('kg', '')
            );
            if (oldValue < newRecordValue) {
              records[recordsHistory].record = newRecordValue + 'kg';
              records[recordsHistory].timestamp = Date.now();
            }
          } else {
            const newRecord = {
              exerciseId: current.exerciseId,
              record: newRecordValue + 'kg',
              timestamp: Date.now()
            };
            records.push(newRecord);
          }
        }
      }

      this.setState({
        records: records
      });

      this.props.workoutLogs.records.map(obj => {
        return database
          .collection('users')
          .doc(_this.props.user.uid)
          .collection('personalRecords')
          .doc(obj.exerciseId)
          .set(obj, { merge: true });
      });
    }

    // If the routine was changed (handicaps) and the user wants that saved, save it
    if (this.state.saveRoutine) {
      const routineSnapshot = this.state.routine,
        workout = this.state.workoutLog;
      workout.exercises.map((value, index) => {
        return (routineSnapshot.exercises[index].handicap = value.handicap);
      });
      this.setState(
        {
          routine: routineSnapshot
        },
        () => {
          database
            .collection('users')
            .doc(_this.props.user.uid)
            .collection('routines')
            .doc(_this.state.routine.routineId.toString())
            .set(_this.state.routine);
        }
      );
    }

    // If there are some exercises the user can upgrade, then we work out which ones and by how much...
    if (this.state.upgradeRoutine) {
      const routine = this.state.routine,
        areUpdatable = this.state.upgradeRoutine;

      for (var x = 0; x < areUpdatable.length; x++) {
        let current = routine.exercises[areUpdatable[x]],
          type = this.props.exercises.list.filter(
            obj => obj.id === current.exerciseId
          )[0].type;

        // Updating the routine...
        if (type === 'cardio') {
          routine.exercises[areUpdatable[x]].handicap =
            parseFloat(routine.exercises[areUpdatable[x]].handicap) + 10;
        } else if (type === 'barbell' || type === 'calisthenics') {
          routine.exercises[areUpdatable[x]].handicap =
            parseFloat(routine.exercises[areUpdatable[x]].handicap) + 5;
        } else {
          routine.exercises[areUpdatable[x]].handicap =
            parseFloat(routine.exercises[areUpdatable[x]].handicap) + 2;
        }
      }

      this.setState(
        {
          routine: routine
        },
        () => {
          // ... then we add to the payload
          database
            .collection('users')
            .doc(this.props.user.uid)
            .collection('routines')
            .doc(this.state.routine.routineId.toString())
            .set(this.state.routine, { merge: true });
        }
      );
    }

    // This is the basic payload, saved whatever happens
    // we use the "today" to update the targeted routine so users know it's the most recently used
    // and we use the state.workout to save into the workout logs so this workout is part of the user's history
    database
      .collection('users')
      .doc(this.props.user.uid)
      .collection('routines')
      .doc(this.state.routine.routineId.toString())
      .update({
        lastPerformed: today.getTime()
      })
      .then(() => {
        database
          .collection('users')
          .doc(_this.props.user.uid)
          .collection('workoutLog')
          .add(_this.state.workoutLog)
          .then(() => {
            _this.setState({
              runningWorkout: false
            });
            setTimeout(() => {
              _this.setState({
                successRedirect: true
              });
            }, 1500);
          });
      });
  }

  showExercise(index) {
    this.setState({
      ongoingExercise: index
    });
  }

  render() {
    const currentRoutine = this.state.workoutLog;

    // For each exercise in the routine, we display a workoutDetails element that will enable users to track their routine
    const workoutItems = currentRoutine.exercises
      ? currentRoutine.exercises.map((value, index) => (
          <WorkoutExerciseTeaser
            key={value.exerciseId + '-' + index}
            index={index}
            contents={value}
            exercisesDatabase={this.props.exercises.list}
            settings={this.props.user.settings}
            showExercise={this.showExercise}
          />
        ))
      : false;

    let workoutExit = (
      <WorkoutExit
        runningStatus={
          this.state.runningWorkout ? this.state.runningWorkout : 'exiting'
        }
        closeRoutineModal={this.closeRoutineModal}
        changedRoutine={this.state.changedRoutine}
        saveRoutine={this.state.saveRoutine ? this.state.saveRoutine : false}
        routineUpdateToggle={this.routineUpdateToggle}
        upgradeRoutine={this.state.upgradeRoutine}
        currentRoutine={this.state.workoutLog}
        originalRoutine={this.state.routine}
        exercisesDatabase={this.props.exercises.list}
        cancelUpdate={this.cancelUpdate}
        writeRoutine={this.saveRoutine}
      />
    );

    let ongoingExercise = false;
    if (this.state.ongoingExercise !== false) {
      const exercise = currentRoutine.exercises[this.state.ongoingExercise];
      ongoingExercise = (
        <WorkoutExerciseFull
          contents={exercise}
          exercisesDatabase={this.props.exercises.list}
          index={this.state.ongoingExercise}
          onUpdate={this.updateRoutine}
          onReps={this.feedReps}
          settings={this.props.user.settings}
        />
      );
    }

    return (
      <div id="Workout" className={this.state.mounted ? 'loaded' : null}>
        {this.state.routine === false ? (
          <div className="workout-grid">
            <div className="head">
              <div className="container">
                <h1>Entraînement introuvable</h1>
                <Link to="/">
                  <FontAwesomeIcon icon={['fas', 'times']} size="1x" />{' '}
                </Link>
              </div>
            </div>
            <div className="container contents empty">
              <div className="message">
                <p>Cet entraînement n'existe pas !</p>
                <Link to="/" className="btn">
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="workout-grid">
            <Prompt
              when={this.state.runningWorkout ? true : false}
              message="Vous n'avez pas terminé cet entrainement. Souhaitez-vous l'annuler ? "
            />
            {this.state.successRedirect ? (
              <Redirect push to={{ pathname: '/' }} />
            ) : (
              false
            )}

            <div className="head">
              <div className="container">
                <h1>
                  Entraînement — <small>{this.state.routine.name}</small>
                </h1>
                <Link to="/">
                  <FontAwesomeIcon icon={['fas', 'times']} size="1x" />{' '}
                </Link>
              </div>
            </div>

            <div className="container contents">
              {this.state.loading ||
              this.state.routine.exercises.length < 1 ||
              this.props.exercises.list.length < 1 ? (
                <InlineLoader copy="Chargement du programme" />
              ) : (
                <Fragment>
                  <WorkoutTabs
                    switchToExercise={this.showExercise}
                    currentExercise={this.state.ongoingExercise}
                    exercisesDatabase={this.props.exercises.list}
                    exercises={
                      this.state.workoutLog.exercises
                        ? this.state.workoutLog.exercises
                        : []
                    }
                  />
                  <div
                    className={
                      'step active-routine ' +
                      (this.state.ongoingExercise === false ? 'active' : '')
                    }>
                    <div className="routine-heading">
                      <h3 className="title">{this.state.routine.name}</h3>
                      <i className="dot" />
                      <p>
                        {this.state.workoutLog.exercises.length < 10
                          ? '0' + this.state.workoutLog.exercises.length
                          : this.state.workoutLog.exercises.length}{' '}
                        exercices
                      </p>
                    </div>
                    <div className="routine-body">
                      <div className="content list">{workoutItems}</div>
                    </div>
                  </div>

                  <div
                    className={
                      'step currentExercise ' +
                      (this.state.ongoingExercise !== false ? 'active' : '')
                    }>
                    {ongoingExercise}
                  </div>
                </Fragment>
              )}
            </div>

            <div className="footer">
              <Stopwatch getCurrentTime={this.getCurrentTime} />
              <div className="action-zone">
                <button
                  className={
                    'action ' +
                    (this.state.ongoingExercise !== false ? 'active' : '')
                  }
                  onClick={this.showExercise.bind(this, false)}>
                  <FontAwesomeIcon icon={['fas', 'arrow-left']} size="1x" />
                  <span>Tous les exercices</span>
                </button>
                <button
                  className={
                    'action ' +
                    (this.state.ongoingExercise === false ? 'active' : '')
                  }
                  onClick={this.endRoutine}>
                  <FontAwesomeIcon icon={['fas', 'stop']} size="1x" />
                  <span>Terminer l'entraînement</span>
                </button>
              </div>
            </div>
            {this.state.exitingRoutine ? workoutExit : false}
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
