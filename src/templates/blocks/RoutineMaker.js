import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { database } from '../../store/';

import ExercisePicker from './Overlays/ExercisePicker';
import InlineLoader from './InlineLoader';
import ExerciseCustomizer from './ExerciseCustomizer';

import moment from 'moment';
import 'moment/locale/fr';

class RoutineMaker extends Component {
  constructor(props) {
    super(props);
    const timestamp = new Date();
    const defaultName = 'Routine ' + moment(timestamp).format('DD-MM-YY');

    // Defaults
    this.state = {
      user: { uid: '0' },
      exercisesDatabase: [],
      newRoutine: {
        routineId: timestamp.getTime(),
        color: '#1FC3AF',
        exercises: [],
        dateCreated: timestamp.getTime(),
        lastPerformed: timestamp.getTime(),
        name: defaultName
      },
      errors: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.updateExercises = this.updateExercises.bind(this);
    this.customizeExercise = this.customizeExercise.bind(this);
    this.organizeExercises = this.organizeExercises.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
  }

  componentDidMount() {
    this.props.toggleMenu('hidden');
    if (this.props.editRoutine) {
      const timestamp = new Date();

      const nextRoutineShot = this.props.editRoutine;
      nextRoutineShot.lastPerformed = timestamp.getTime();
      this.setState({
        newRoutine: nextRoutineShot,
        isEdit: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const timestamp = new Date();

    if (nextProps.editRoutine && nextProps.editRoutine !== 'empty') {
      const nextRoutineShot = nextProps.editRoutine;
      nextRoutineShot.lastPerformed = timestamp.getTime();
      this.setState({
        newRoutine: nextRoutineShot,
        isEdit: true
      });
    }
  }

  componentWillUnmount() {
    this.props.toggleMenu('default');
  }

  validate(event) {
    event.preventDefault();
    let currentErrors = false;

    // Updating the current errors array with whatever's been required but failed to be created
    if (!this.state.newRoutine.name || this.state.newRoutine.name.length <= 0) {
      currentErrors =
        typeof currentErrors === 'boolean'
          ? (currentErrors = {})
          : currentErrors;
      currentErrors.name = "Le nom de l'entraînement doit être rempli";
    }
    if (this.state.newRoutine.exercises.length === 0) {
      currentErrors =
        typeof currentErrors === 'boolean'
          ? (currentErrors = {})
          : currentErrors;
      currentErrors.exercises = 'Vous devez ajouter au moins un exercice';
    }

    // Updating the error state. If it's filled, then the submission will fail
    this.setState(
      {
        errors: currentErrors
      },
      () => {
        // If it's still false, then we proceed
        if (!this.state.errors) {
          const userId = this.props.user.uid,
            addedRoutine = this.state.newRoutine,
            _this = this,
            verb = this.state.isEdit ? 'put' : 'post';

          this.setState({
            saving: true
          });

          if (verb === 'post') {
            database
              .collection('users')
              .doc(userId)
              .collection('routines')
              .doc(addedRoutine.routineId.toString())
              .set(addedRoutine)
              .then(() => {
                _this.props.watchRoutines();
                _this.setState({
                  saving: false,
                  successRedirect: true
                });
              });
          } else if (verb === 'put') {
            database
              .collection('users')
              .doc(userId)
              .collection('routines')
              .doc(addedRoutine.routineId.toString())
              .update(addedRoutine)
              .then(() => {
                _this.props.watchRoutines();
                _this.setState({
                  saving: false,
                  successRedirect: true
                });
              });
          }
        }
      }
    );
  }

  handleInputChange(event) {
    const target = event.target,
      value = target.type === 'checkbox' ? target.checked : target.value,
      name = target.name;

    var routine = this.state.newRoutine;

    routine[name] = value;

    this.setState({
      newRoutine: routine
    });
  }

  displayModal(event) {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    });
  }

  updateExercises(data) {
    // This gets called by the exercise picker and adds / remove the exercises that are part of the routine
    const routineSnapshot = this.state.newRoutine;
    routineSnapshot.exercises = data;
    this.setState({
      newRoutine: routineSnapshot
    });
  }

  removeExercise(data) {
    let currentExercises = this.state.newRoutine.exercises;
    currentExercises.splice(data, 1);
    this.updateExercises(currentExercises);
  }

  customizeExercise(index, event) {
    // This is what happens when you try to change the number of sets or reps or handicap on an exercise
    const target = event.target,
      name = target.name;

    let value = target.type === 'checkbox' ? target.checked : target.value;

    if (name === 'sets' || name === 'reps') {
      value = value < 1 ? 1 : value;
    }

    const routineSnapshot = this.state.newRoutine;
    routineSnapshot.exercises[index][name] = value;
    this.setState({
      newRoutine: routineSnapshot
    });
  }

  organizeExercises(index, direction, event) {
    // We use this to move exercises up and down the list for better ordering
    const routineSnapshot = this.state.newRoutine,
      exercisesLength = routineSnapshot.exercises.length;

    let exercises = routineSnapshot.exercises;

    const moveIndex = (array, old_index, new_index) => {
      if (new_index >= array.length) {
        var k = new_index - array.length;
        while (k-- + 1) {
          array.push(undefined);
        }
      }
      array.splice(new_index, 0, array.splice(old_index, 1)[0]);
      return array; // for testing purposes
    };

    if (index === 0 && direction === 'up') {
      return false;
    } else if (index === exercisesLength - 1 && direction === 'down') {
      return false;
    } else if (direction === 'up') {
      moveIndex(exercises, index, index - 1);
    } else if (direction === 'down') {
      moveIndex(exercises, index, index + 1);
    }

    routineSnapshot.exercises = exercises;

    this.setState({
      newRoutine: routineSnapshot
    });
  }

  render() {
    let listExercises = <p>Aucun exercice n'a été ajouté</p>;
    if (this.state.newRoutine.exercises.length > 0) {
      listExercises = this.state.newRoutine.exercises.map((value, index) => (
        <ExerciseCustomizer
          database={this.props.exercises}
          currentExercise={value}
          key={index + '-' + value.exerciseId}
          index={index}
          last={index === this.state.newRoutine.exercises.length - 1}
          newValues={this.customizeExercise}
          organize={this.organizeExercises}
          removeExercise={this.removeExercise}
        />
      ));
    }

    return (
      <div id="RoutineMaker">
        {this.state.loading ? (
          <div className="container empty">
            <InlineLoader copy="Chargement de la routine" />
          </div>
        ) : (
          <form onSubmit={this.validate}>
            <div className="routine-labels">
              <div
                className={
                  this.state.errors.name ? 'form-group has-error' : 'form-group'
                }>
                <label>Nom de l'entraînement</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  onChange={this.handleInputChange}
                  value={this.state.newRoutine.name}
                  placeholder="Ex: Routine du Lundi"
                />
                {this.state.errors.name ? (
                  <span className="help-block">{this.state.errors.name}</span>
                ) : (
                  false
                )}
              </div>
            </div>

            <div
              className={
                this.state.newRoutine.exercises.length === 0
                  ? ' routine-exercises empty'
                  : 'routine-exercises'
              }>
              <h3 className="label">
                {this.state.newRoutine.exercises.length > 0
                  ? this.state.newRoutine.exercises.length
                  : null}{' '}
                Exercice{this.state.newRoutine.exercises.length > 1 ||
                this.state.newRoutine.exercises.length === 0
                  ? 's'
                  : null}{' '}
                lié{this.state.newRoutine.exercises.length > 1 ||
                this.state.newRoutine.exercises.length === 0
                  ? 's'
                  : null}
              </h3>
              <div
                className={
                  this.state.errors.exercises
                    ? 'form-group has-error'
                    : 'form-group'
                }>
                {listExercises}
                {this.state.errors.exercises ? (
                  <span className="help-block">
                    {this.state.errors.exercises}
                  </span>
                ) : (
                  false
                )}
              </div>
            </div>

            {this.state.saving ? (
              <div className="routine-footer saving">
                <InlineLoader copy="Sauvegarde en cours" />
              </div>
            ) : (
              <div className="routine-footer">
                <Link to="/" className="btn rewind">
                  <FontAwesomeIcon icon={['fas', 'arrow-left']} size="1x" />
                </Link>
                <button
                  className="btn"
                  type="button"
                  onClick={this.displayModal}>
                  {this.state.newRoutine.exercises.length > 0 ? (
                    <Fragment>
                      <FontAwesomeIcon icon={['fal', 'edit']} size="1x" />{' '}
                      Modifier les exercices
                    </Fragment>
                  ) : (
                    <Fragment>
                      <FontAwesomeIcon icon={['fal', 'plus']} size="1x" />{' '}
                      Ajouter un exercice
                    </Fragment>
                  )}
                </button>
                {this.state.isEdit ? (
                  <button
                    type="submit"
                    className="btn important"
                    disabled={
                      this.state.newRoutine.exercises.length <= 0 ||
                      this.state.newRoutine.name.length <= 0
                        ? true
                        : false
                    }>
                    <FontAwesomeIcon icon={['fal', 'save']} size="1x" />
                    Enregistrer la routine
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn important"
                    disabled={
                      this.state.newRoutine.exercises.length <= 0 ||
                      this.state.newRoutine.name.length <= 0
                        ? true
                        : false
                    }>
                    <FontAwesomeIcon icon={['fal', 'save']} size="1x" />
                    Créer la routine
                  </button>
                )}
                {this.state.success ? (
                  <div className="panel-warning">
                    <p>
                      Bravo ! Votre entraînement a été créé ! Vous allez être
                      redirigé vers le dashboard...
                    </p>
                  </div>
                ) : (
                  false
                )}
              </div>
            )}
            {this.state.successRedirect ? (
              <Redirect
                push
                to={{ pathname: '/all-routines', state: { newRoutine: true } }}
              />
            ) : (
              false
            )}
          </form>
        )}

        <ExercisePicker
          exercisesDatabase={this.props.exercises}
          shouldAppear={this.state.modalDisplay ? 'opened' : 'closed'}
          modalCloser={this.displayModal}
          updateExercises={this.updateExercises}
          settings={this.props.user}
          pickedExercises={this.state.newRoutine.exercises}
        />
      </div>
    );
  }
}

export default RoutineMaker;
