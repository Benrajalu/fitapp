import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExerciseListing extends Component {
  render() {
    const currentExercise = this.props.exerciseData;
    const exercisesDatabase = this.props.exercisesDatabase;
    const status = this.props.status ? this.props.status : false;


    // Translating exercises ID into proper exercises from the exercise database. 
    const trueExercise = exercisesDatabase.filter(obj => obj.id === currentExercise.exerciceId )[0];

    // Using the Exercise database, determine the handicap unit and type related to the picked exercises
    let unit = false,
        type = undefined;

    switch (trueExercise.type) {
      case 'barbell':
      case 'dumbbell':
      case 'cable':
      case 'calisthenics':
        unit = 'kg'; 
        type = 'weighted'
      break;

      case 'cardio':
        unit = 'minutes';
        type = 'cardio';
      break;

      default:
        unit = false;
        type = 'irrelevant';
    }

    function setEngine(data) {
      let numberOfSets = 1, 
          numberOfReps = 1, 
          setValues = [], 
          repsTarget = 0;

      const handicap = data.handicap, 
            sets = [];  

      // If there is no "status" or it is false, then the listing is "inactive" : it doesn't show performance, but goals
      if (!status){
        numberOfSets = data.sets ? data.sets : 1;
        numberOfReps = data.reps ? data.reps : 1;
      }
      // If it's in the past, then the "sets" have been filled and data.sets will be an array. We'll need to know what the requested number of reps was
      else if(status === 'past'){
        numberOfSets = data.sets ? data.sets.length : 1;
        setValues = data.sets ? data.sets : [];
        repsTarget = data.repTarget;
      }

      
      let i = 0;
      for(i; i<numberOfSets; i++){
        // For all sets
        // We either show the number of reps performed by the user ("past" records)...
        if(status === 'past'){
          // If the exercise is cardio, then it's no '12 set x 20kg', but a simple time limit reached or failed, so the string changes for that
          let repIndicator = ''; 
          if(type !== "cardio"){
            repIndicator = "x ";
          }
          else{
            repIndicator = "sur ";
          }

          // Access the value of registered reps for this set in the array
          numberOfReps = setValues[i];

          // We calculate the percentage of fullfillment for the set by comparing the registered number of reps vs the required total
          const progress = (numberOfReps * 100) / repsTarget;

          sets.push(
            <div className={"status " + status} key={i + trueExercise.name}>
              <div className="progress">
                <div className={progress !== 100 ? 'progress-bar' : 'progress-bar progress-bar-success'}  role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{width: progress + '%'}}>
                    {numberOfReps} { handicap ? repIndicator + (handicap + unit) : 'reps'}
                </div>
              </div>
            </div>
          )
        }
        // Or display the user's goals (passive routine check)
        else{
          sets.push(
            <div className={"status " + status} key={i + trueExercise.name}>
              <p>{numberOfReps} { handicap ? 'x ' + (handicap + unit) : 'reps'}</p>
            </div>
          )
        }
      }

      return sets;
    }

    return (
      <div>
        <h3>{trueExercise.name}</h3>
        {setEngine(currentExercise)}
      </div>
    )
  }
}

ExerciseListing.propTypes = {
  exerciseData: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  status: PropTypes.string
}

export default ExerciseListing;
