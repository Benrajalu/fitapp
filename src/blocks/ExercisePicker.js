import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExercisePickerDetails from '../blocks/ExercisePickerDetails';
import ExercisePickerPick from '../blocks/ExercisePickerPick';

import '../styles/modals.css';

class ExercisePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: []
    };

    this.closeModal = this.closeModal.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
  }
  closeModal() {
    // References the parent method for displaying a modal that's in Dashboard.js
    this.props.modalCloser();
  }
  addExercise(data) {
    let currentExercises = this.state.exercises;
    currentExercises.push(data);
    this.setState({
      exercises: currentExercises
    });
    this.props.exercises(this.state.exercises);
  }
  removeExercise(data) {
    let currentExercises = this.state.exercises;
    let i;
    for(i= 0; i < currentExercises.length; i++){
      // Find where the exercice is in the array and remove it. If there's more than one of that exercise, only one of them gets removed
      if(currentExercises[i] === data) {
        currentExercises.splice(i, 1);
        i = currentExercises.length;
      }
    }
    this.setState({
      exercises: currentExercises
    });
    this.props.exercises(this.state.exercises);
  }

  render() {
    // Initializing pop-in state
      const displayStatus = this.props.shouldAppear, 
            sortFunction = (a,b) => {return a.muscleGroup < b.muscleGroup ? -1 : a.muscleGroup > b.muscleGroup ? 1 : 0};

    // Sorting and filtering exercises by types and muscle groups when relevant 
      const barbellExercises = this.props.exercisesDatabase.filter(obj => obj.type === "barbell" ).sort(sortFunction);
      const dumbbellExercises = this.props.exercisesDatabase.filter(obj => obj.type === "dumbbell" ).sort(sortFunction);
      const cableExercises = this.props.exercisesDatabase.filter(obj => obj.type === "cable" ).sort(sortFunction);
      const cardioExercises = this.props.exercisesDatabase.filter(obj => obj.type === "cardio" );
      const calisthenicsExercises = this.props.exercisesDatabase.filter(obj => obj.type === "calisthenics" );

    // Looping through the filtered ans sorted output to create the DOM elements
      const showBarbells = barbellExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id}/>
      ),
      showDumbbells = dumbbellExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id}/>
      ),
      showCables = cableExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id}/>
      ),
      showCalithenics = calisthenicsExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id}/>
      ),
      showCardio = cardioExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id}/>
      );


    // Listing any current exercice added to the routine and setting a default message for none. 
      let currentExercisesList = <p>Aucun exercice selectionné</p>;
      if(this.state.exercises.length > 0){
        currentExercisesList = this.state.exercises.map((value, index) => 
          <ExercisePickerPick database={this.props.exercisesDatabase} currentExercise={value} handleClick={this.removeExercise} key={value + '-' + new Date().getTime() + index}/>
        );
      }

    return (
      <div className={"routineLauncher popin large " + displayStatus}>
        <div className="contents">
          <button className="closer" onClick={this.closeModal}>Close modal</button>
          <div className="currentPick">
            <h4>Exercices sélectionnés</h4>
            {currentExercisesList}
          </div>
          <div className="main-list">
            <h4>Cliquez sur un exercice pour l'ajouter</h4>
            {showBarbells}
            {showDumbbells}
            {showCables}
            {showCalithenics}
            {showCardio}
          </div>
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
