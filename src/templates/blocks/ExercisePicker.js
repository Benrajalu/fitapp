import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ExercisePickerDetails from '../blocks/ExercisePickerDetails';
import ExercisePickerPick from '../blocks/ExercisePickerPick';

import '../../styles/modals.css';
import '../../styles/ExercisePicker.css';

class ExercisePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: this.props.pickedExercises ? this.props.pickedExercises : [],
      animate: ' animate'
    };

    this.closeModal = this.closeModal.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pickedExercises) {
      this.setState({
        exercises: nextProps.pickedExercises
      });
    }
  }

  componentDidMount() {
    const _this = this;
    setTimeout(function() {
      _this.setState({
        animate: false
      });
    }, 100);
  }

  closeModal() {
    this.props.modalCloser();
  }
  addExercise(data) {
    let currentExercises = this.state.exercises;
    currentExercises.push(data);
    this.setState({
      exercises: currentExercises,
      animateList: true
    });
    this.props.updateExercises(this.state.exercises);
    const _this = this;
    setTimeout(() => {
      _this.setState({
        animateList: false
      });
    }, 100);
  }
  removeExercise(data) {
    let currentExercises = this.state.exercises;
    currentExercises.splice(data, 1);
    this.setState({
      exercises: currentExercises,
      animateList: true
    });
    this.props.updateExercises(this.state.exercises);
    const _this = this;
    setTimeout(() => {
      _this.setState({
        animateList: false
      });
    }, 100);
  }

  applyFilter(filter) {
    let exerciseList = [];
    switch (filter) {
      case 'none':
        this.setState({
          filtered: false,
          filter: false
        });
        break;

      case 'barbell':
        exerciseList = this.props.exercisesDatabase.filter(
          obj => obj.type === 'barbell'
        );
        this.setState({
          filtered: exerciseList,
          filter: 'barbell'
        });
        break;

      case 'dumbbell':
        exerciseList = this.props.exercisesDatabase.filter(
          obj => obj.type === 'dumbbell'
        );
        this.setState({
          filtered: exerciseList,
          filter: 'dumbbell'
        });
        break;

      case 'cable':
        exerciseList = this.props.exercisesDatabase.filter(
          obj => obj.type === 'cable'
        );
        this.setState({
          filtered: exerciseList,
          filter: 'cable'
        });
        break;

      case 'calisthenics':
        exerciseList = this.props.exercisesDatabase.filter(
          obj => obj.type === 'calisthenics'
        );
        this.setState({
          filtered: exerciseList,
          filter: 'calisthenics'
        });
        break;

      case 'cardio':
        exerciseList = this.props.exercisesDatabase.filter(
          obj => obj.type === 'cardio'
        );
        this.setState({
          filtered: exerciseList,
          filter: 'cardio'
        });
        break;

      case 'lower-body':
        exerciseList = this.props.exercisesDatabase.filter(
          obj => obj.muscleGroup === 'lower-body'
        );
        this.setState({
          filtered: exerciseList,
          filter: 'lower-body'
        });
        break;

      case 'upper-body':
        exerciseList = this.props.exercisesDatabase.filter(
          obj => obj.muscleGroup === 'upper-body'
        );
        this.setState({
          filtered: exerciseList,
          filter: 'upper-body'
        });
        break;

      default:
        this.setState({
          filtered: false,
          filter: false
        });
        break;
    }
  }

  render() {
    // Initializing pop-in state
    const displayStatus = this.props.shouldAppear,
      sortFunction = (a, b) => {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      };

    // Sorting and filtering exercises by types and muscle groups when relevant
    const listedExercises = this.state.filtered
      ? this.state.filtered.sort(sortFunction)
      : this.props.exercisesDatabase.sort(sortFunction);

    // Looping through the filtered ans sorted output to create the DOM elements
    const showExercises = listedExercises.map(value => (
      <ExercisePickerDetails
        data={value}
        handleClick={this.addExercise}
        key={value.id}
        exercisesDatabase={this.props.exercisesDatabase}
        userSettings={this.props.user}
      />
    ));

    // Listing any current exercice added to the routine and setting a default message for none.
    let currentExercisesList = (
      <p className="empty-state">Aucun exercice sélectionné</p>
    );
    if (this.state.exercises.length > 0) {
      currentExercisesList = this.state.exercises.map((value, index) => (
        <ExercisePickerPick
          database={this.props.exercisesDatabase}
          currentExercise={value}
          handleClick={this.removeExercise}
          index={index}
          key={value.exerciseId + '-' + new Date().getTime() + index}
        />
      ));
    }

    return (
      <div className={'popin ' + displayStatus}>
        <div className="modal-header">
          <div className="container">
            <p className="title">Choisir des exercices</p>
            <button className="closer" onClick={this.closeModal}>
              <FontAwesomeIcon icon={['far', 'times']} size="1x" />
            </button>
          </div>
        </div>
        <div className="modal-options">
          <div className="container">
            <ul className="options">
              <li>
                <button
                  className={!this.state.filter ? 'filter active' : 'filter'}
                  onClick={this.applyFilter.bind(this, 'none')}>
                  <span>Tous</span>
                </button>
              </li>
              <li>
                <button
                  className={
                    this.state.filter && this.state.filter === 'barbell'
                      ? 'filter active'
                      : 'filter'
                  }
                  onClick={this.applyFilter.bind(this, 'barbell')}>
                  <span>Barre</span>
                </button>
              </li>
              <li>
                <button
                  className={
                    this.state.filter && this.state.filter === 'dumbbell'
                      ? 'filter active'
                      : 'filter'
                  }
                  onClick={this.applyFilter.bind(this, 'dumbbell')}>
                  <span>Haltères</span>
                </button>
              </li>
              <li>
                <button
                  className={
                    this.state.filter && this.state.filter === 'cable'
                      ? 'filter active'
                      : 'filter'
                  }
                  onClick={this.applyFilter.bind(this, 'cable')}>
                  <span>Câble</span>
                </button>
              </li>
              <li>
                <button
                  className={
                    this.state.filter && this.state.filter === 'calisthenics'
                      ? 'filter active'
                      : 'filter'
                  }
                  onClick={this.applyFilter.bind(this, 'calisthenics')}>
                  <span>Calisthenics</span>
                </button>
              </li>
              <li>
                <button
                  className={
                    this.state.filter && this.state.filter === 'cardio'
                      ? 'filter active'
                      : 'filter'
                  }
                  onClick={this.applyFilter.bind(this, 'cardio')}>
                  <span>Cardio</span>
                </button>
              </li>
              <li>
                <button
                  className={
                    this.state.filter && this.state.filter === 'upper-body'
                      ? 'filter active'
                      : 'filter'
                  }
                  onClick={this.applyFilter.bind(this, 'upper-body')}>
                  <span>Haut du corps</span>
                </button>
              </li>
              <li>
                <button
                  className={
                    this.state.filter && this.state.filter === 'lower-body'
                      ? 'filter active'
                      : 'filter'
                  }
                  onClick={this.applyFilter.bind(this, 'lower-body')}>
                  <span>Bas du corps</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-contents" id="ExercisePicker">
          <div className="main-list">
            <div className="container">{showExercises}</div>
          </div>
          <div className="currentPick">
            <div className="container">
              <h4>
                <FontAwesomeIcon icon={['far', 'angle-up']} size="1x" />{' '}
                <span>Sélectionnez vos exercices ci-dessus</span>{' '}
                <FontAwesomeIcon icon={['far', 'angle-up']} size="1x" />
              </h4>
              <div
                className={
                  this.state.animateList
                    ? 'current-exercises animated'
                    : 'current-exercises'
                }>
                {currentExercisesList}
              </div>
              <button onClick={this.closeModal} className="close-button">
                {this.state.exercises.length > 0
                  ? 'Configurez ces exercises'
                  : 'Modifier la routine'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExercisePicker.propTypes = {
  shouldAppear: PropTypes.string.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
};

export default ExercisePicker;
