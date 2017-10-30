import React, { Component } from 'react';
import {Redirect} from 'react-router';
import {firebaseAuth, database} from '../utils/fire';

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
    const _this = this;
    firebaseAuth.onAuthStateChanged(function(user) {
      if (user) {
        const userQuery = database.collection('users').doc(user.uid);
        
        database.collection('exercises').get().then((snapshot) => {
          const output = [];
          snapshot.forEach((doc) => {
            output.push(doc.data());
          });
          _this.setState({
            exercisesDatabase: output
          })
        });

        userQuery.get().then((doc) => {
          if(doc.exists){
            const userObj = doc.data();
            userObj.uid = user.uid;
            _this.setState({
              user:userObj
            });
          }
          else{
            firebaseAuth.signOut();
          }
        })
      } else {
        firebaseAuth.signOut();
      }
    });
    if(this.props.editRoutine){  
      const timestamp = new Date();

      const dd = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(), 
            mm = timestamp.getMonth()+1 < 10 ? '0' + (timestamp.getMonth()+1) : timestamp.getMonth()+1,
            yyyy = timestamp.getFullYear(),
            fullDate = dd+'/'+mm+'/'+yyyy;

      const nextRoutineShot = this.props.editRoutine;
      nextRoutineShot.lastPerformed = fullDate;
      this.setState({
        newRoutine: nextRoutineShot, 
        isEdit: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const timestamp = new Date();

    const dd = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(), 
          mm = timestamp.getMonth()+1 < 10 ? '0' + (timestamp.getMonth()+1) : timestamp.getMonth()+1,
          yyyy = timestamp.getFullYear(),
          fullDate = dd+'/'+mm+'/'+yyyy;
    

    if(nextProps.editRoutine && nextProps.editRoutine !== "empty"){
      const nextRoutineShot = nextProps.editRoutine;
      nextRoutineShot.lastPerformed = fullDate;
      this.setState({
        newRoutine: nextRoutineShot, 
        isEdit: true
      });

      console.log(this.state.newRoutine);
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

        const userId = this.state.user.uid, 
              addedRoutine = this.state.newRoutine, 
              _this = this, 
              verb = this.state.isEdit ? 'put' : 'post';

        if(verb === "post"){
          database.collection('users').doc(userId).collection('routines').doc(addedRoutine.routineId.toString()).set(addedRoutine).then(() => {
            _this.setState({
              successRedirect:true
            });
          })
        }
        else if(verb === "put"){
          database.collection('users').doc(userId).collection('routines').doc(addedRoutine.routineId.toString()).update(addedRoutine).then(() => {
            _this.setState({
              successRedirect:true
            });
          })  
        }
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
        {this.state.loading ? 
          <div className="container">
            <p>Chargement de l'entrainement...</p>
          </div>
          :
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
            {this.state.successRedirect ? <Redirect push to={{ pathname:'/all-routines', state:{newRoutine:true} }} /> : false}
          </form>
        }

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
