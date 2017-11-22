import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExerciseListing extends Component {
  render() {
    const currentExercise = this.props.exerciseData;
    const exercisesDatabase = this.props.exercisesDatabase;
    const status = this.props.status ? this.props.status : false;


    // Translating exercises ID into proper exercises from the exercise database. 
    const trueExercise = exercisesDatabase.filter(obj => obj.id === currentExercise.exerciseId )[0];

    if(trueExercise){
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
          unit = 'min';
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
            repsTarget = 0,
            sets = []; 

        const handicap = data.handicap; 

        // If there is no "status" or it is false, then the listing is "inactive" : it doesn't show performance, but goals
        if (!status){
          numberOfSets = data.sets ? data.sets : 1;
          numberOfReps = data.reps ? data.reps : 1;
        }
        // If it's in the past, then the "sets" have been filled and data.sets will be an array. We'll need to know what the requested number of reps was
        else if(status === 'past'){
          numberOfSets = data.sets ? data.sets.length : 1;
          setValues = data.sets ? data.sets : [];
          repsTarget = data.repTarget ? data.repTarget : data.handicap;
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
            const progress = numberOfReps > 0 ? ((numberOfReps * 100) / repsTarget) : 0;

            sets.push(
              <div className={"status " + status} key={i + trueExercise.name}>
                <div className={progress !== 100 ? 'progress' : 'progress progress-success'}>
                  <p className={progress > 0 ? 'progress-value' : 'progress-value fail'}>{numberOfReps} { handicap !== 0 ? repIndicator + (handicap + unit) : 'reps'}</p>
                  <div className={progress !== 100 ? 'progress-bar' : 'progress-bar progress-bar-success'}  role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{width: progress + '%'}}></div>
                </div>
              </div>
            )
          }
          // Or display the user's goals (passive routine check)
          else{
            sets = <div className={!status ? "status listing" : "status"} key={i + trueExercise.name}>
                    {numberOfSets > 1 ? <p className="set-number">{numberOfSets} <strong>sets</strong></p> : <p className="set-number">1 <strong>set</strong></p>}
                    <p className="rep-number">{numberOfReps} <strong>{numberOfReps > 1 ? "reps" : "rep"}</strong></p>
                    { handicap ? <p className="handicap-number">{handicap} <strong>{unit}</strong></p> : null }
                   </div>;
          }
        }

        return sets;
      }
      return (
        <div className="routine-log">
          <h3 className="exercise-name">{trueExercise.name}</h3>
          {setEngine(currentExercise)}
        </div>
      )
    }
    else{
      return false
    }
  }
}

ExerciseListing.propTypes = {
  exerciseData: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  status: PropTypes.string
}

export default ExerciseListing;
