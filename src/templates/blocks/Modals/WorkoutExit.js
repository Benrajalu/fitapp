import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import WorkoutUpdates from '../../blocks/WorkoutUpdates';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import moment from 'moment';
import 'moment/locale/fr';

class WorkoutExit extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.endRoutine = this.endRoutine.bind(this);
    this.getCompletedSets = this.getCompletedSets.bind(this);
    this.state = {
      visible: null,
      runningStatus: false
    };
  }
  componentDidMount() {
    const _this = this;
    setTimeout(function() {
      _this.setState({
        visible: ' visible'
      });
    }, 100);
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
            saveRoutine: true
          });
        } else if (this.state.changedRoutine) {
          // routine has been changed but no set has been completed
          this.setState({
            saveRoutine: true,
            upgradeRoutine: false
          });
        } else {
          this.setState({
            upgradeRoutine: false,
            saveRoutine: false
          });
        }
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log('here');
    this.endRoutine();
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

  render() {
    console.log(this.props);
    const upgradeExercises = this.props.upgradeRoutine,
      allExercises = this.props.saveRoutine
        ? this.props.currentRoutine.exercises
        : this.props.originalRoutine.exercises;

    const updates = upgradeExercises
      ? upgradeExercises.map((value, index) => (
          <WorkoutUpdates
            key={'log-' + index + '-' + value}
            completedSet={value}
            allSets={allExercises}
            database={this.props.exercisesDatabase}
            notUpdating={this.props.cancelUpdate}
          />
        ))
      : false;

    let contents = <div className="contents" />;

    contents = (
      <Fragment>
        {this.props.changedRoutine ? (
          <div className="exit-panel">
            <h3 className="panel-title">Routine modifiée</h3>
            <p>
              Vous avez changé certains poids pour cet entrainement, souhaitez
              vous enregistrer ces modifications ?{' '}
            </p>
            <div className="change-saver">
              <input
                type="checkbox"
                name="saveRoutine"
                value="yes"
                checked={this.props.saveRoutine ? true : false}
                onChange={this.props.routineUpdateToggle}
              />
              <label onClick={this.props.routineUpdateToggle}>
                Enregistrer les modifications
              </label>
            </div>
          </div>
        ) : (
          false
        )}
        {this.props.upgradeRoutine ? (
          <div className="exit-panel">
            <h3 className="panel-title">Exercices à augmenter</h3>
            <div className="action">
              <button>Tous / Aucun</button>
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
              <div className="window-body no-padding exit">
                <div className="exit-content">
                  <div className="intro exit-panel">
                    <p className="title">Félicitations !</p>
                    <p>{this.props.currentRoutine.routineName}</p>
                  </div>
                  {this.props.currentRoutine.time &&
                  this.props.currentRoutine.time > 0 ? (
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
                    onClick={this.props.writeRoutine}
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WorkoutExit.propTypes = {};

export default WorkoutExit;
