import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Prompt } from 'react-router';
import { connect } from 'react-redux';
import { watchRoutines } from '../../actions/RoutinesActions';
import { changeLayout } from '../../actions/MenuActions';
import { toggleModal } from '../../actions/ModalActions';

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
    modals: state.modals,
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
    },
    toggleModal: data => {
      dispatch(toggleModal(data));
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
    this.closeRoutineModal = this.closeRoutineModal.bind(this);
    this.getCurrentTime = this.getCurrentTime.bind(this);
    this.showExercise = this.showExercise.bind(this);
    this.setNewHeight = this.setNewHeight.bind(this);
    this.startStopwatch = this.startStopwatch.bind(this);
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
      loading: false,
      height: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
    });
    setTimeout(() => {
      _this.setState({
        mounted: true
      });
    }, 200);
  }

  componentWillReceiveProps(nextProps) {
    // Check if the next props are trying to feed the currentlu fed routine again
    // You don't want to overwrite the currently used routine
    // It would set back all changes to their originals.
    // Opening a pop-up (warmup) changes the redux State, thus feeding this new props
    // therefore without this check, opening a modal would erase progress
    if (
      parseFloat(nextProps.match.params.id) !==
      parseFloat(this.state.routine.routineId)
    ) {
      this.getRoutine(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.changeLayout('default');
  }

  updateRoutine(index, event) {
    // When the workout detail component wants to update handicaps, we do it here
    let changedName = event.target['name'],
      changedValue = event.target.value;

    if (changedName === 'handicap' && changedValue < 0) {
      changedValue = 0;
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

  closeRoutineModal() {
    // We trigger the modal factory from here because it enables us to also
    // stop the stopwatch if it's been triggered and get its data to feed it
    // into the modal.
    // Once the flag to stop the modal has been used, we use a timer to remove it
    const _this = this;
    this.setState({ stopTimer: true });
    this.props.toggleModal({
      type: 'endWorkout',
      changedRoutine: this.state.changedRoutine,
      currentRoutine: this.state.workoutLog ? this.state.workoutLog : false,
      originalRoutine: this.state.routine ? this.state.routine : false
    });
    setTimeout(() => {
      _this.setState({ stopTimer: false });
    }, 100);
  }

  showExercise(index) {
    this.setState({
      ongoingExercise: index
    });
  }

  setNewHeight() {
    this.setState({
      height: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
    });
  }

  startStopwatch() {
    this.setState({
      startStopwatch: true
    });
    setTimeout(() => {
      this.setState({
        startStopwatch: false
      });
    }, 100);
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
            onReps={this.feedReps}
            startStopwatch={this.startStopwatch}
          />
        ))
      : false;

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
          showExercise={this.showExercise}
          toggleModal={this.props.toggleModal}
          last={
            this.state.ongoingExercise + 1 === currentRoutine.exercises.length
              ? true
              : false
          }
        />
      );
    }
    return (
      <div id="Workout" className={this.state.mounted ? 'loaded' : null}>
        {this.state.routine === false ? (
          <div className="workout-grid" style={{ height: this.state.height }}>
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
          <div className="workout-grid" style={{ height: this.state.height }}>
            <Prompt
              when={this.props.modals.status === 'closed'}
              message="Vous n'avez pas terminé cet entrainement. Souhaitez-vous l'annuler ? "
            />
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
              <Stopwatch
                getCurrentTime={this.getCurrentTime}
                stop={this.state.stopTimer}
                start={this.state.startStopwatch}
              />
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
                  onClick={this.closeRoutineModal.bind(this)}>
                  <FontAwesomeIcon icon={['fas', 'stop']} size="1x" />
                  <span>Terminer l'entraînement</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
