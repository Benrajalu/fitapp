import React, { Component } from 'react';
import users from '../data/users.json';

class RoutineMaker extends Component {
  constructor(props) {
    super(props);
    const timestamp = new Date();
    this.state = {
      user: {}, 
      newRoutine: {
        routineId: timestamp.getTime(),
        routineColor : "#67E658", 
        exercises : []
      },
      errors:{}
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.addExercise = this.addExercise.bind(this);
  }

  componentDidMount() {
    this.setState({user: users[0]});
  }

  addExercise(event) {
    event.preventDefault();

    var routine = this.state.newRoutine;

    routine.exercises.push(
      {
        exerciceId: "ex-04", 
        sets: "1", 
        reps: "1",
        handicap: "20"
      }
    );

    this.setState({
      newRoutine : routine
    })
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


  render() {
    return (
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
          {this.state.newRoutine.exercises.length > 0 ? <p>Exo id: {this.state.newRoutine.exercises[0].exerciceId}</p> : <p>Aucun exercice n'a été ajouté</p>}
          {this.state.errors.exercises ? <span className="help-block">{this.state.errors.exercises}</span> : false }
          <button className="btn btn-primary" type="button" onClick={this.addExercise}>Ajouter un exercice</button>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-default">Submit</button>
        </div>
      </form>
    )
  }
}

export default RoutineMaker;
