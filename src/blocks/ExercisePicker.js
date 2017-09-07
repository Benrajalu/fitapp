import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExercisePickerDetails from '../blocks/ExercisePickerDetails';

import '../styles/modals.css';

class ExercisePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: []
    };

    this.closeModal = this.closeModal.bind(this);
    this.addExercise = this.addExercise.bind(this);
  }
  closeModal() {
    // References the parent method for displaying a modal that's in Dashboard.js
    this.props.modalCloser();
  }

  addExercise(data) {
    let currentExercices = this.state.exercises;
    currentExercices.push(data);
    this.setState({
      exercises: currentExercices
    });
    console.log(this.state.exercises);
  }

  render() {
    // Initializing pop-in state
    const displayStatus = this.props.shouldAppear, 
          sortFunction = (a,b) => {return a.muscleGroup < b.muscleGroup ? -1 : a.muscleGroup > b.muscleGroup ? 1 : 0};

    // Sorting and filtering exercises by types and muscle groups when relevant 
    const barbellExercises = this.props.exercisesDatabase.filter(obj => obj.type === "barbell" ).sort(sortFunction);
    const dumbbellExercises = this.props.exercisesDatabase.filter(obj => obj.type === "dumbbell" ).sort(sortFunction);
    const cableExercises = this.props.exercisesDatabase.filter(obj => obj.type === "cableExercises" ).sort(sortFunction);
    const cardioExercises = this.props.exercisesDatabase.filter(obj => obj.type === "cardioExercises" );
    const calisthenicsExercises = this.props.exercisesDatabase.filter(obj => obj.type === "calisthenicsExercises" );

    const showBarbells = barbellExercises.map((value) => 
      <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id}/>
    )

    return (
      <div className={"routineLauncher popin " + displayStatus}>
        <div className="contents">
          {showBarbells}
          <button className="closer" onClick={this.closeModal}>Close modal</button>
        </div>
      </div>
    )
  }
}

ExercisePicker.propTypes = {
  shouldAppear: PropTypes.string.isRequired,  
  exercisesDatabase: PropTypes.array.isRequired,  
}

export default ExercisePicker;
