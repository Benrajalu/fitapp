import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import { database } from '../../../store';
import PropTypes from 'prop-types';

import WorkoutUpdates from '../../blocks/WorkoutUpdates';
import IntensityPicker from '../WorkoutBlocks/IntensityPicker';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import InlineLoader from '../../blocks/InlineLoader';

import moment from 'moment';
import 'moment/locale/fr';

class WorkoutExit extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.getCompletedSets = this.getCompletedSets.bind(this);
    this.updateIntensity = this.updateIntensity.bind(this);
    this.toggleSaveRoutine = this.toggleSaveRoutine.bind(this);
    this.toggleExerciseUpdate = this.toggleExerciseUpdate.bind(this);
    this.toggleAllExercisesUpdates = this.toggleAllExercisesUpdates.bind(this);
    this.saveRoutine = this.saveRoutine.bind(this);
    this.state = {
      visible: null,
      intensity: 1,
      runningStatus: false,
      completedExercises: false,
      toUpgrade: []
    };
  }
  componentDidMount() {
    const _this = this;
    this.setState({ completedExercises: this.getCompletedSets() });
    setTimeout(function() {
      _this.setState({
        visible: ' visible'
      });
    }, 100);
  }

  componentDidUpdate() {
    this.getCompletedSets();
  }

  getCompletedSets() {
    const log = this.props.currentRoutine.exercises,
      completedExercises = [];

    for (let i = 0; i < log.length; i++) {
      // Check if this has a repTargt. If it's cardio, the target IS the handicap
      let repTarget = log[i].repTarget
          ? parseFloat(log[i].repTarget)
          : parseFloat(log[i].handicap),
        successFullSets = log[i].sets
          ? log[i].sets.filter(value => value === repTarget)
          : [];
      if (log[i].sets && log[i].sets.length === successFullSets.length) {
        // If all repored reps are equal the target, on all sets, then push the exercise index to the array
        completedExercises.push(i);
      }
    }
    return completedExercises;
  }

  toggleExerciseUpdate(data) {
    let updatables = this.state.toUpgrade ? this.state.toUpgrade : [];
    // Whe users want to cancel a planned upgrade to one of their sets, we use this tu remove the set from the upgradeRoutine array
    if (updatables.includes(data)) {
      let index = updatables.indexOf(data);
      updatables.splice(index, 1);
    } else {
      updatables.push(data);
    }

    this.setState({
      toUpgrade: updatables
    });
  }

  toggleAllExercisesUpdates() {
    if (this.state.toUpgrade && this.state.toUpgrade.length > 0) {
      this.setState({
        toUpgrade: false
      });
    } else {
      this.setState({
        toUpgrade: this.getCompletedSets()
      });
    }
  }

  closeModal() {
    const _this = this;
    this.setState({
      visible: null
    });
    setTimeout(function() {
      // References the parent method for displaying a modal that's in Dashboard.js
      _this.props.closeModal();
    }, 300);
  }

  updateIntensity(data) {
    this.setState({
      intensity: data
    });
  }

  toggleSaveRoutine() {
    this.setState({
      saveRoutine: !this.state.saveRoutine
    });
  }

  saveRoutine() {
    const _this = this,
      workout = this.props.currentRoutine;

    workout.timestamp = new Date().getTime();

    if (this.state.intensity && this.state.intensity > 0) {
      workout.intensity = this.state.intensity;
    }

    if (this.props.currentRoutine.time && this.props.currentRoutine.time > 0) {
      workout.time = this.props.currentRoutine.time;
    }

    this.setState({
      saving: true,
      workoutLog: workout
    });

    // If some sets have been completed, then we update the user's personal records because they did good
    if (
      this.state.completedExercises &&
      this.state.completedExercises.length > 0
    ) {
      const routine = workout,
        areUpdatable = this.state.completedExercises,
        records = this.props.records ? this.props.records : [];

      for (var xb = 0; xb < areUpdatable.length; xb++) {
        let current = routine.exercises[areUpdatable[xb]],
          type = this.props.exercisesDatabase.filter(
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

      this.setState(
        {
          newRecords: records
        },
        () => {
          this.state.newRecords.map(obj => {
            return database
              .collection('users')
              .doc(this.props.user.uid)
              .collection('personalRecords')
              .doc(obj.exerciseId)
              .set(obj, { merge: true })
              .catch(error => console.log(error));
          });
        }
      );
    }

    // If the routine was changed (handicaps) and the user wants that saved, save it
    if (this.state.saveRoutine) {
      const routineSnapshot = this.props.originalRoutine,
        workout = this.props.currentRoutine;
      workout.exercises.map((value, index) => {
        return (routineSnapshot.exercises[index].handicap = value.handicap);
      });
      routineSnapshot.lastPerformed = Date.now();
      this.setState(
        {
          routine: routineSnapshot
        },
        () => {
          database
            .collection('users')
            .doc(this.props.user.uid)
            .collection('routines')
            .doc(this.props.originalRoutine.routineId.toString())
            .set(this.state.routine);
        }
      );
    }

    // If there are some exercises the user can upgrade, then we work out which ones and by how much...
    if (this.state.toUpgrade.length > 0) {
      const routine = this.props.originalRoutine,
        areUpdatable = this.state.toUpgrade;

      for (var x = 0; x < areUpdatable.length; x++) {
        let current = routine.exercises[areUpdatable[x]],
          type = this.props.exercisesDatabase.filter(
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

      routine.lastPerformed = Date.now();

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
            .doc(this.props.originalRoutine.routineId.toString())
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
      .doc(this.props.originalRoutine.routineId.toString())
      .update({
        lastPerformed: new Date().getTime()
      })
      .then(() => {
        database
          .collection('users')
          .doc(this.props.user.uid)
          .collection('workoutLog')
          .add(this.props.currentRoutine)
          .then(() => {
            this.setState({
              runningWorkout: false
            });
            this.props.watchLogs();
            this.props.watchRecords();
            this.props.watchRoutines();
            setTimeout(() => {
              _this.setState({
                successRedirect: true
              });
              this.closeModal();
            }, 1500);
          });
      });
  }

  render() {
    const upgradeExercises = this.state.completedExercises,
      allExercises = this.state.saveRoutine
        ? this.props.currentRoutine.exercises
        : this.props.originalRoutine.exercises;

    const updates = upgradeExercises
      ? upgradeExercises.map((value, index) => {
          return (
            <WorkoutUpdates
              key={'log-' + index + '-' + value}
              completedSet={value}
              allSets={allExercises}
              database={this.props.exercisesDatabase}
              toggleUpdate={this.toggleExerciseUpdate}
              willUpgrade={
                this.state.toUpgrade && this.state.toUpgrade.includes(value)
              }
              index={index}
            />
          );
        })
      : false;

    let contents = <div className="contents" />;

    contents = (
      <Fragment>
        {this.props.changedRoutine ? (
          <div className="exit-panel">
            <h3 className="panel-title">Routine modifiée</h3>
            <div className="input-pair">
              <label htmlFor="saveRoutine" onClick={this.toggleSaveRoutine}>
                Vous avez changé certains poids pour cet entrainement, souhaitez
                vous enregistrer ces modifications ?{' '}
              </label>
              <div className="input">
                <input
                  type="checkbox"
                  name="saveRoutine"
                  id="saveRoutine"
                  value={this.state.saveRoutine ? true : false}
                  checked={this.state.saveRoutine ? true : false}
                />
                <label htmlFor="saveRoutine" onClick={this.toggleSaveRoutine}>
                  {this.state.saveRoutine ? 'oui' : 'non'}
                </label>
              </div>
            </div>
          </div>
        ) : (
          false
        )}
        {this.state.completedExercises &&
        this.state.completedExercises.length > 0 ? (
          <div className="exit-panel">
            <h3 className="panel-title">Exercices à augmenter</h3>
            <div className="action">
              <button onClick={this.toggleAllExercisesUpdates}>
                Tous / Aucun
              </button>
            </div>
            {updates}
          </div>
        ) : (
          false
        )}
      </Fragment>
    );

    if (this.state.runningStatus === 'saving') {
      contents = (
        <div>
          <div className="inlineLoader">
            <p>Sauvegarde en cours...</p>
          </div>
        </div>
      );
    }

    if (this.state.runningStatus === 'exiting') {
      contents = (
        <div>
          {this.props.saveRoutine || this.props.upgradeRoutine ? (
            <p className="title align-center">
              Vos choix ont bien été enregistrés !
            </p>
          ) : (
            false
          )}
          <i className="fa fa-check large-icon" />
          <p className="title align-center">
            Nous vous redirigons vers le dashboard !
          </p>
        </div>
      );
    }

    let timeFormat =
      this.props.currentRoutine.time && this.props.currentRoutine.time < 3600
        ? 'mm:ss'
        : 'kk:mm:ss';

    return (
      <div className={'modal ' + this.state.visible}>
        <div className="modal-contents">
          <div className="container padding-left">
            <div className="window">
              <div className="window-head">
                <div className="title">
                  <h3>Entraînement terminé</h3>
                </div>
                <button className="close" onClick={this.closeModal}>
                  <FontAwesomeIcon icon={['fas', 'times']} size="1x" />
                </button>
              </div>
              <div className="window-body exit no-padding">
                <div
                  className={
                    this.state.saving ? 'exit-slide' : 'exit-slide active'
                  }>
                  <div className="exit-content">
                    <div className="intro exit-panel">
                      <p className="title">Félicitations !</p>
                      <p>{this.props.currentRoutine.routineName}</p>
                    </div>
                    {this.props.currentRoutine.time &&
                    this.props.currentRoutine.time > 0 ? (
                      <Fragment>
                        <div className="exit-panel">
                          <h3 className="panel-title">Temps actif</h3>
                          <p className="value">
                            {moment()
                              .set('hour', 0)
                              .set('minute', 0)
                              .set('second', 0)
                              .second(this.props.currentRoutine.time)
                              .format(timeFormat)}
                          </p>
                        </div>
                        <div className="exit-panel">
                          <h3 className="panel-title">Intensité</h3>
                          <IntensityPicker
                            updateIntensity={this.updateIntensity}
                            value={this.state.intensity}
                          />
                        </div>
                      </Fragment>
                    ) : (
                      <div className="exit-panel">
                        <h3 className="panel-title">Conseil</h3>
                        <p>
                          Pensez à enclancher le chronomètre pendant votre
                          prochaine séance pour un meilleur tracking !
                        </p>
                      </div>
                    )}
                    {contents}
                  </div>
                  <div className="exit-buttons">
                    <button
                      onClick={this.saveRoutine}
                      disabled={
                        this.state.runningStatus === 'saving' ||
                        this.state.runningStatus === 'exiting'
                      }>
                      Enregistrer l'entraînement
                    </button>
                    <button
                      onClick={this.closeModal}
                      disabled={
                        this.state.runningStatus === 'saving' ||
                        this.state.runningStatus === 'exiting'
                      }>
                      Annuler
                    </button>
                  </div>
                </div>
                <div
                  className={
                    this.state.saving
                      ? 'exit-slide loading active'
                      : 'exit-slide loading'
                  }>
                  <InlineLoader
                    copy={
                      this.state.saving
                        ? 'Enregistrement en cours'
                        : "Redirection vers l'accueil"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.successRedirect && window.location.pathname !== '/' ? (
          <Redirect push to={{ pathname: '/' }} />
        ) : (
          false
        )}
      </div>
    );
  }
}

WorkoutExit.propTypes = {
  closeModal: PropTypes.func.isRequired,
  changedRoutine: PropTypes.bool,
  currentRoutine: PropTypes.object.isRequired,
  originalRoutine: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  workoutLogs: PropTypes.array.isRequired,
  records: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  watchLogs: PropTypes.func.isRequired,
  watchRecords: PropTypes.func.isRequired,
  watchRoutines: PropTypes.func.isRequired
};

export default WorkoutExit;
