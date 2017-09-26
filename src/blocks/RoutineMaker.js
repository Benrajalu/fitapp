import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';

import users from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import ExercisePicker from '../blocks/ExercisePicker';
import ExerciseCustomizer from '../blocks/ExerciseCustomizer';

class RoutineMaker extends Component {
  constructor(props) {
    super(props);
    const timestamp = new Date();

    const dd = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(), 
          mm = timestamp.getMonth()+1 < 10 ? '0' + (timestamp.getMonth()+1) : timestamp.getMonth()+1,
          yyyy = timestamp.getFullYear(),
          fullDate = dd+'/'+mm+'/'+yyyy;
    

    // Defaults
    this.state = {
      user: {}, 
      exercisesDatabase: [],
      newRoutine: {
        routineId: timestamp.getTime(),
        color : "#67E658", 
        exercises : [], 
        dateCreated: fullDate,
        lastPerformed: fullDate
      },
      errors:{}
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.updateExercises = this.updateExercises.bind(this);
    this.customizeExercise = this.customizeExercise.bind(this);
    this.organizeExercises = this.organizeExercises.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: users[0],
      exercisesDatabase: exercisesDatabase
    });
  }

  componentWillReceiveProps(nextProps) {
    const timestamp = new Date();

    const dd = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(), 
          mm = timestamp.getMonth()+1 < 10 ? '0' + (timestamp.getMonth()+1) : timestamp.getMonth()+1,
          yyyy = timestamp.getFullYear(),
          fullDate = dd+'/'+mm+'/'+yyyy;
    

    if(nextProps.editRoutine){
      const nextRoutineShot = nextProps.editRoutine;
      nextRoutineShot.lastPerformed = fullDate;
      this.setState({
        newRoutine: nextRoutineShot
      })
    }
  }

  validate(event){
    event.preventDefault();
    let currentErrors = false;
    
    // Updating the current errors array with whatever's been required but failed to be created
    if(!this.state.newRoutine.name || this.state.newRoutine.name.length <= 0){
      currentErrors = typeof currentErrors === "boolean" ? currentErrors = {} : currentErrors;
      currentErrors.name = "Le nom de l'entraînement doit être rempli";
    }
    if(this.state.newRoutine.exercises.length === 0){
      currentErrors = typeof currentErrors === "boolean" ? currentErrors = {} : currentErrors;
      currentErrors.exercises = "Vous devez ajouter au moins un exercice";
    }
    
    // Updating the error state. If it's filled, then the submission will fail
    this.setState({
      errors: currentErrors
    }, () => {
      // If it's still false, then we proceed
      if (!this.state.errors){
        console.log("Congrats, built this new routine :");
        console.log(this.state.newRoutine);

        const userId = this.state.user.id, 
              addedRoutine = this.state.newRoutine, 
              _this = this;

        axios({
          method: 'post', 
          url: '../data/users.json',
          data: {
            userId: userId,
            newRoutine: addedRoutine
          }
        })
        .then(function(response){
          console.log("that's a pass!");
          console.log(response);
        })
        .catch(function(error){
          console.log("that's a fail : " + error.message);
          // Mock success still 
          _this.setState({
            success:true
          });
          setTimeout(() => {
            _this.setState({
              successRedirect:true
            });
          }, 1500);
        })
      }
    })
  }

  handleInputChange(event){
    const target = event.target,
          value = target.type === 'checkbox' ? target.checked : target.value,
          name = target.name;

    var routine = this.state.newRoutine;

    routine[name] = value;

    this.setState({
      newRoutine: routine
    })
  }

  displayModal(event) {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    })
  }

  updateExercises(data) {
    // This gets called by the exercise picker and adds / remove the exercises that are part of the routine
    const routineSnapshot = this.state.newRoutine;
    routineSnapshot.exercises = data;
    this.setState({
      newRoutine: routineSnapshot
    })
  }

  customizeExercise(index, event){
    // This is what happens when you try to change the number of sets or reps or handicap on an exercise
    const target = event.target,
          name = target.name;

    let value = target.type === 'checkbox' ? target.checked : target.value;

    if(name === "sets" || name === "reps"){
      value = value < 1 ? 1 : value;
    }

    const routineSnapshot = this.state.newRoutine;
    routineSnapshot.exercises[index][name] = value;
    this.setState({
      newRoutine: routineSnapshot
    })
  }

  organizeExercises(index, direction, event){
    // We use this to move exercises up and down the list for better ordering
    const routineSnapshot = this.state.newRoutine, 
          exercisesLength = routineSnapshot.exercises.length;

    let exercises = routineSnapshot.exercises;

    const moveIndex = (array, old_index, new_index) => {
      if (new_index >= array.length) {
          var k = new_index - array.length;
          while ((k--) + 1) {
              array.push(undefined);
          }
      }
      array.splice(new_index, 0, array.splice(old_index, 1)[0]);
      return array; // for testing purposes
    };
    
    if(index === 0 && direction === "up"){
      return false;
    }
    else if(index === exercisesLength - 1 && direction === "down"){
      return false;
    }
    else if(direction === "up"){
      moveIndex(exercises, index, index-1);
    }
    else if(direction === "down"){
      moveIndex(exercises, index, index+1);
    }

    routineSnapshot.exercises = exercises;

    this.setState({
      newRoutine: routineSnapshot
    });
  }


  render() {
    let listExercises = <p>Aucun exercice n'a été ajouté</p>;
    if(this.state.newRoutine.exercises.length > 0){
      listExercises= this.state.newRoutine.exercises.map((value, index) => 
        <ExerciseCustomizer database={this.state.exercisesDatabase} currentExercise={value} key={index + '-' + value.exerciseId} index={index} newValues={this.customizeExercise} organize={this.organizeExercises}/>
      )
    }

    return (
      <div id="RoutineMaker">
        <form onSubmit={this.validate} className="container">
          <div className={this.state.errors.name ? "form-group has-error" : "form-group"}>
            <label>Routine name</label>
            <input type="text" name="name" className="form-control" onChange={this.handleInputChange} value={this.state.newRoutine.name ? this.state.newRoutine.name : ""} />
            {this.state.errors.name ? <span className="help-block">{this.state.errors.name}</span> : false }
          </div>
          <div className="form-group">
            <label>Routine color</label>
            <div className="radio">
                <label>
                  <input type="radio" name="color" value="#67E658" onChange={this.handleInputChange} checked={this.state.newRoutine.color === "#67E658" ? true : false} /> <span style={{ "color": "#67E658" }}>Neon green</span>
                </label>
            </div>
            <div className="radio">
                <label>
                  <input type="radio" name="color" value="#DF8833" onChange={this.handleInputChange} checked={this.state.newRoutine.color === "#DF8833" ? true : false} /> <span style={{ color: "#DF8833" }}>Mad orange</span>
                </label>
            </div>
            <div className="radio">
                <label>
                  <input type="radio" name="color" value="#F30012" onChange={this.handleInputChange} checked={this.state.newRoutine.color === "#F30012" ? true : false} /> <span style={{ color: "#F30012" }}>Damn red</span>
                </label>
            </div>
          </div>
          <div className={this.state.errors.exercises ? "form-group has-error" : "form-group"}>
            <label>Exercices</label>
            {listExercises}
            {this.state.errors.exercises ? <span className="help-block">{this.state.errors.exercises}</span> : false }
            <button className="btn btn-primary" type="button" onClick={this.displayModal}>Ajouter un exercice</button>
          </div>
          <hr/>
          <div className="form-group">
            <button type="submit" className="btn btn-default">Submit</button>
            {this.state.success ? <div className="panel-warning"><p>Bravo ! Votre entraînement a été créé ! Vous allez être redirigé vers le dashboard...</p></div> : false}
          </div>
          {this.state.successRedirect ? <Redirect push to={{ pathname:'/', state:{newRoutine:true} }} /> : false}
        </form>

        <ExercisePicker 
          exercisesDatabase={this.state.exercisesDatabase} 
          shouldAppear={this.state.modalDisplay ? 'visible' : 'hidden'} 
          modalCloser={this.displayModal}
          updateExercises={this.updateExercises}
          settings={this.state.user}
          pickedExercises={this.state.newRoutine.exercises} />
      </div>
    )
  }
}

export default RoutineMaker;
