import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExercisePickerDetails from '../blocks/ExercisePickerDetails';
import ExercisePickerPick from '../blocks/ExercisePickerPick';

import '../styles/modals.css';
import '../styles/ExercisePicker.css';

class ExercisePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: this.props.pickedExercises ? this.props.pickedExercises : [],
      animate: " animate" 
    };

    this.closeModal = this.closeModal.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.pickedExercises){
      this.setState({
        exercises: nextProps.pickedExercises
      })
    }
  }

  componentDidMount() {
    const _this = this;
    setTimeout(function(){
      _this.setState({
        animate: false
      })
    }, 100);
  }

  closeModal() {
    const _this = this;
    this.setState({
      animate: " animate"
    });
    setTimeout(function(){
      // References the parent method for displaying a modal that's in Dashboard.js
      _this.props.modalCloser();
    }, 300);
  }
  addExercise(data) {
    let currentExercises = this.state.exercises;
    currentExercises.push(data);
    this.setState({
      exercises: currentExercises
    });
    this.props.updateExercises(this.state.exercises);
  }
  removeExercise(data) {
    console.log(data);
    let currentExercises = this.state.exercises;
    let i;
    for(i= 0; i < currentExercises.length; i++){
      // Find where the exercice is in the array and remove it. If there's more than one of that exercise, only one of them gets removed
      if(currentExercises[i].exerciseId === data) {
        currentExercises.splice(i, 1);
        i = currentExercises.length;
      }
    }
    this.setState({
      exercises: currentExercises
    });
    this.props.updateExercises(this.state.exercises);
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
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id} exercisesDatabase={this.props.exercisesDatabase} userSettings={this.props.user} />
      ),
      showDumbbells = dumbbellExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id} exercisesDatabase={this.props.exercisesDatabase} userSettings={this.props.user} />
      ),
      showCables = cableExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id} exercisesDatabase={this.props.exercisesDatabase} userSettings={this.props.user} />
      ),
      showCalithenics = calisthenicsExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id} exercisesDatabase={this.props.exercisesDatabase} userSettings={this.props.user} />
      ),
      showCardio = cardioExercises.map((value) => 
        <ExercisePickerDetails data={value} handleClick={this.addExercise} key={value.id} exercisesDatabase={this.props.exercisesDatabase} userSettings={this.props.user} />
      );


    // Listing any current exercice added to the routine and setting a default message for none. 
      let currentExercisesList = <p className="empty-state">Aucun exercice selectionné</p>;
      if(this.state.exercises.length > 0){
        currentExercisesList = this.state.exercises.map((value, index) => 
          <ExercisePickerPick database={this.props.exercisesDatabase} currentExercise={value} handleClick={this.removeExercise} key={value.exerciseId + '-' + new Date().getTime() + index}/>
        );
      }

    return (
      <div className={"popin large " + displayStatus + this.state.animate}>
        <div className="modal-header">
          <div className="container">
            <p className="title">Choisissez vos exercices</p>
            <button className="closer" onClick={this.closeModal}>Fermer</button>
          </div>
        </div>
        <div className="modal-contents" id="ExercisePicker">
          <div className="currentPick">
            <div className="container">
              <h4>Exercices sélectionnés</h4>
              <div className="current-exercises">
                {currentExercisesList}
              </div>
            </div>
          </div>
          <div className="main-list">
            <div className="container">
              <h4>Cliquez sur un exercice pour l'ajouter</h4>
              {showBarbells}
              {showDumbbells}
              {showCables}
              {showCalithenics}
              {showCardio}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ExercisePicker.propTypes = {
  shouldAppear: PropTypes.string.isRequired,  
  exercisesDatabase: PropTypes.array.isRequired,  
  settings: PropTypes.object.isRequired
}

export default ExercisePicker;
