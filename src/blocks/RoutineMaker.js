import React, { Component } from 'react';
import users from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import ExercisePicker from '../blocks/ExercisePicker';

class RoutineMaker extends Component {
  constructor(props) {
    super(props);
    const timestamp = new Date();
    this.state = {
      user: {}, 
      exercisesDatabase: [],
      newRoutine: {
        routineId: timestamp.getTime(),
        routineColor : "#67E658", 
        exercises : []
      },
      errors:{}
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.updateExercises = this.updateExercises.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: users[0],
      exercisesDatabase: exercisesDatabase
    });
  }

  validate(event){
    event.preventDefault();
    let currentErrors = false;

    if(!this.state.newRoutine.routineName || this.state.newRoutine.routineName.length <= 0){
      currentErrors = typeof currentErrors === "boolean" ? currentErrors = {} : currentErrors;
      currentErrors.routineName = "Le nom de l'entraînement doit être rempli";
    }
    if(this.state.newRoutine.exercises.length === 0){
      currentErrors = typeof currentErrors === "boolean" ? currentErrors = {} : currentErrors;
      currentErrors.exercises = "Vous devez ajouter au moins un exercice";
    }

    this.setState({
      errors: currentErrors
    }, () => {
      if (!this.state.errors){
        console.log("Congrats, built this new routine :");
        console.log(this.state.newRoutine);
      }
      else{
        console.log(this.state.errors);
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

    console.log(this.state.newRoutine);
  }

  displayModal(event) {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    })
  }

  updateExercises(data) {
    const routineSnapshot = this.state.newRoutine;
    routineSnapshot.exercises = data;
    this.setState({
      newRoutine: routineSnapshot
    })
  }


  render() {
    let listExercises = <p>Aucun exercice n'a été ajouté</p>;
    if(this.state.newRoutine.exercises.length > 0){
      listExercises= this.state.newRoutine.exercises.map((value, index) => 
        <p key={value.id + '-' + index}>{value.exerciseId}</p>
      )
    }

    return (
      <div id="RoutineMaker">
        <form onSubmit={this.validate} className="container">
          <div className={this.state.errors.routineName ? "form-group has-error" : "form-group"}>
            <label>Routine name</label>
            <input type="text" name="routineName" className="form-control" onChange={this.handleInputChange} />
            {this.state.errors.routineName ? <span className="help-block">{this.state.errors.routineName}</span> : false }
          </div>
          <div className="form-group">
            <label>Routine color</label>
            <div className="radio">
                <label>
                  <input type="radio" name="routineColor" value="#67E658" onChange={this.handleInputChange} checked={this.state.newRoutine.routineColor === "#67E658" ? true : false} /> <span style={{ "color": "#67E658" }}>Neon green</span>
                </label>
            </div>
            <div className="radio">
                <label>
                  <input type="radio" name="routineColor" value="#DF8833" onChange={this.handleInputChange} checked={this.state.newRoutine.routineColor === "#DF8833" ? true : false} /> <span style={{ color: "#DF8833" }}>Mad orange</span>
                </label>
            </div>
            <div className="radio">
                <label>
                  <input type="radio" name="routineColor" value="#F30012" onChange={this.handleInputChange} checked={this.state.newRoutine.routineColor === "#F30012" ? true : false} /> <span style={{ color: "#F30012" }}>Damn red</span>
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
          </div>
        </form>

        <ExercisePicker 
          exercisesDatabase={this.state.exercisesDatabase} 
          shouldAppear={this.state.modalDisplay ? 'visible' : 'hidden'} 
          modalCloser={this.displayModal}
          exercises={this.updateExercises}
          settings={this.state.user} />
      </div>
    )
  }
}

export default RoutineMaker;
